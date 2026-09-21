require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const setupCommand = {
  name: "setup",
  description: "Create the full aesthetic catboy/catgirl server",
  default_member_permissions: PermissionFlagsBits.Administrator.toString()
};

const roles = [
  "꒰ 𝓞𝔀𝓷𝓮𝓻 ꒱",
  "୨୧ 𝓐𝓭𝓶𝓲𝓷",
  "♡ 𝓜𝓸𝓭𝓮𝓻𝓪𝓽𝓸𝓻",
  "✦ 𝑫𝒆𝒗𝒆𝒍𝒐𝒑𝒆𝒓",
  "𐙚 𝒞𝒶𝓉𝑔𝒾𝓇𝓁",
  "♡ 𝒞𝒶𝓉𝒷𝑜𝓎",
  "୨୧ 𝒞𝓊𝓉𝒾𝑒",
  "꒰ 𝑀𝑒𝓂𝒷𝑒𝓇 ꒱"
];

const categories = {
  "╭・୨୧・𝓦𝓮𝓵𝓬𝓸𝓶𝓮": [
    "♡・𝓌𝑒𝓁𝒸𝑜𝓂𝑒",
    "୨୧・𝓇𝓊𝓁𝑒𝓈",
    "𐙚・𝒾𝓃𝓉𝓇𝑜𝓈",
    "✧・𝓋𝑒𝓇𝒾𝒻𝓎"
  ],

  "╭・୨୧・𝓛𝓸𝓾𝓷𝓰𝓮": [
    "♡・𝒸𝒽𝒶𝓉",
    "୨୧・𝓇𝒶𝓃𝒹𝑜𝓂",
    "𐙚・𝓂𝑒𝒹𝒾𝒶",
    "✦・𝓂𝑒𝓂𝑒𝓈",
    "♡・𝓁𝒶𝓉𝑒-𝓃𝒾𝑔𝒽𝓉"
  ],

  "╭・୨୧・𝓒𝓪𝓽 𝓒𝓵𝓾𝓫": [
    "♡・𝒸𝒶𝓉𝑔𝒾𝓇𝓁𝓈",
    "୨୧・𝒸𝒶𝓉𝒷𝑜𝓎𝓈",
    "𐙚・𝒸𝓊𝓉𝑒-𝓅𝒾𝒸𝓈",
    "✧・𝓂𝒶𝓉𝒸𝒽𝒾𝓃𝑔",
    "♡・𝓀𝒾𝓉𝓉𝓎-𝒸𝒽𝒶𝓉"
  ],

  "╭・୨୧・𝓥𝓸𝓲𝓬𝓮": [
    "♡・𝒸𝒽𝒾𝓁𝓁",
    "୨୧・𝑔𝒶𝓂𝒾𝓃𝑔",
    "𐙚・𝓁𝒶𝓉𝑒-𝓃𝒾𝑔𝒽𝓉"
  ]
};

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: [setupCommand] }
    );

    console.log("Registered /setup");
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "setup") return;

  if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: "You need Administrator permission to use this.",
      ephemeral: true
    });
  }

  await interaction.reply({
    content: "୨୧ setting everything up... ♡",
    ephemeral: true
  });

  const guild = interaction.guild;

  // Create roles
  for (const roleName of roles) {
    if (!guild.roles.cache.some(r => r.name === roleName)) {
      await guild.roles.create({
        name: roleName,
        reason: "Aesthetic server setup"
      });
    }
  }

  // Create categories and channels
  for (const [categoryName, channels] of Object.entries(categories)) {
    let category = guild.channels.cache.find(
      c => c.name === categoryName && c.type === ChannelType.GuildCategory
    );

    if (!category) {
      category = await guild.channels.create({
        name: categoryName,
        type: ChannelType.GuildCategory
      });
    }

    for (const channelName of channels) {
      const exists = guild.channels.cache.find(
        c =>
          c.name === channelName &&
          c.parentId === category.id
      );

      if (!exists) {
        await guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          parent: category.id
        });
      }
    }
  }

  await interaction.editReply(
    "୨୧・♡ your aesthetic server is ready! 𐙚"
  );
});

client.login(process.env.TOKEN);