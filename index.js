const { Client } = require("discord.js-selfbot-v13");
const client = new Client();
const { joinVoiceChannel } = require("@discordjs/voice");

const USER_TOKEN = process.env.USER_TOKEN;
  const GUILD_ID = "1425520120540692644";
const VOICE_CHANNEL_ID = "1429237653286555861";
const TEXT_CHANNEL_ID = "1004948341769121803";

let afkStartTime = null;

client.on("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  try {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) {
      console.error("❌ Guild not found!");
      return;
    }

    const voiceChannel = guild.channels.cache.get(VOICE_CHANNEL_ID);
    if (!voiceChannel || voiceChannel.type !== "GUILD_VOICE") {
      console.error("❌ Voice channel not found or invalid!");
      return;
    }

    joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: true, // اجعل البوت مكتومًا إذا لزم الأمر
    });

    console.log(`✅ Joined voice channel: ${voiceChannel.name}`);
  } catch (error) {
    console.error("❌ Error joining voice channel:", error);
  }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (oldState.guild.id !== GUILD_ID || newState.guild.id !== GUILD_ID) return;

try {
  const user = await client.users.fetch(TEXT_CHANNEL_ID);
  user.send(`📢 قام المستخدم بمغادرة الروم الصوتي بعد قضاء **${minutes} دقيقة**.`);
} catch (err) {
  console.error("❌ Failed to send message to user:", err);
}

  // المستخدم دخل الغرفة الصوتية
  if (
    newState.channelId === VOICE_CHANNEL_ID &&
    oldState.channelId !== VOICE_CHANNEL_ID
  ) {
    afkStartTime = Date.now();
    console.log(`✅ User joined the voice channel.`);
  }

  // المستخدم غادر الغرفة الصوتية
  if (
    oldState.channelId === VOICE_CHANNEL_ID &&
    newState.channelId !== VOICE_CHANNEL_ID
  ) {
    if (afkStartTime) {
      const timeSpent = Date.now() - afkStartTime;
      const minutes = Math.floor(timeSpent / 60000);

      if (textChannel) {
        textChannel.send(
          `📢 قام المستخدم بمغادرة الروم الصوتي بعد قضاء **${minutes} دقيقة**.`
        );
      }

      console.log(`✅ User left the voice channel after ${minutes} minutes.`);
      afkStartTime = null;
    }
  }
});

require("dotenv").config();
client.login(process.env.TOKEN);