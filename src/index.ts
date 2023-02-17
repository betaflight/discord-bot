import "reflect-metadata";
import { EmbedBuilder } from '@discordjs/builders';
import { Stopwatch } from '@sapphire/stopwatch';

import { SapphireClient, LogLevel } from "@sapphire/framework";
import {
  ClientOptions,
  GatewayIntentBits,
  PermissionFlagsBits,
  OAuth2Scopes,
  ForumChannel,
  TextChannel
} from "discord.js";

import * as schedule from 'node-schedule';

import config from "./config/env";
import db from "./database";
import { PRService } from "./services/pr.service";
import database from "./database";
import GitHub from "./github";

const clientConfig: ClientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessageReactions,
  ],
  loadMessageCommandListeners: true,
  logger: {
    level: LogLevel.Debug,
  },
};

if (config.env === "dev") {
  clientConfig.defaultPrefix = "!";
}

const client = new SapphireClient(clientConfig);

async function run() {
  await db.init();

  await client.login(process.env.TOKEN);
  /* 
  const init = await client.application?.commands.fetch('1072156214168928307');

  console.log(init);

  await init?.delete(); */

  await client.user?.setUsername(
    config.name + (config.env === "dev" ? " (dev)" : "")
  );

  const invite = await client.generateInvite({
    scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
    permissions: [
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ChangeNickname,
      PermissionFlagsBits.ManageEmojisAndStickers,
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.SendMessagesInThreads,
      PermissionFlagsBits.CreatePrivateThreads,
      PermissionFlagsBits.CreatePublicThreads,
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ManageThreads,
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.AttachFiles,
      PermissionFlagsBits.ReadMessageHistory,
      PermissionFlagsBits.MentionEveryone,
      PermissionFlagsBits.AddReactions,
    ],
  });

  client.logger.info("INVITE", invite);

  const prService = new PRService();
  const github = new GitHub();

  const labels = config.labels.map(l => l.toLowerCase());

  // @ts-ignore
  const job = async () => {
    const forum_channel_config = await database.repos.ConfigRepository.findOneBy({
        name: 'forum-channel'
    });

    const spam_channel_config = await database.repos.ConfigRepository.findOneBy({
      name: 'bot-channel'
  });

    if (!forum_channel_config || !spam_channel_config) {
        return null;
    }

    const guild = await client.guilds.fetch(forum_channel_config.guild_id);
    
    const forum_channel: ForumChannel = (await guild.channels.fetch(forum_channel_config.value)) as ForumChannel;
    const spam_channel: TextChannel = (await guild.channels.fetch(spam_channel_config.value)) as TextChannel;

    const msg = await spam_channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription("Cleaning: processing\nCrawling: processing")
          .setFooter({
            text: "Start: " + new Date().toLocaleString()
          })
      ]
    });

    const timer = new Stopwatch(2);
    timer.start();

    await prService.clean(forum_channel);

    timer.stop();
    const cleanTime = timer.toString();

    await msg.edit({
      embeds: [
        new EmbedBuilder(msg.embeds[0].toJSON())
          .setDescription(`Cleaning: done (${cleanTime})\nCrawling: processing`)
      ]
    })

    timer.reset();
    timer.start();

    for (const repo of config.github.repos) {
      const prs = await github.getTestingRequiredPullRequests(repo);

      if (prs) {
        for (const pr of prs.data) {
          if (
            pr.labels.find(
              (l: any) => labels.includes(l.name.toLowerCase())
            ) === undefined
          ) {
            continue;
          }

          await prService.process(pr, repo, forum_channel);
        }
      }
    }

    timer.stop();

    await msg.edit({
      embeds: [
        new EmbedBuilder(msg.embeds[0].toJSON())
          .setDescription(`Cleaning: done (${cleanTime})\nCrawling: done (${timer.toString()})`)
          .setFooter({
            text: 'total: ' + (cleanTime + timer.duration) + 'ms'
          })
      ]
    })

    return null;
  }

  if (config.env === 'prod') {
    schedule.scheduleJob('0 * * * *', () => {
      job();
    }).invoke();
  }
}

run();
