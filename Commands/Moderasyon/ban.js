const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// Yetkililerin ID'lerini burada tanımla
const yetkiliRolIDs = ['1243569763486007386'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bir üyeyi yasakla')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('hedef')
                .setDescription('Yasaklanacak üyeyi seçiniz')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('neden')
                .setDescription('Yasaklanma Sebebi')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { options, channel, guild, member } = interaction;
        const user = options.getUser('hedef');
        const reason = options.getString('neden') || 'Neden Belirtilmedi';

        // Eğer komutu kullanan kişinin yetkisi yoksa işlem yapma
        if (!member.roles.cache.some(role => yetkiliRolIDs.includes(role.id))) {
            const errEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription("Bu komutu kullanmaya yetkiniz yok.");

            return await interaction.reply({ embeds: [errEmbed] });
        }

        const memberToBan = await guild.members.fetch(user.id);

        try {
            await memberToBan.ban({ reason });

            const embed = new EmbedBuilder()
                .setColor('Purple')
                .setDescription(`${user} yasaklandı. Yasaklanma nedeni: ${reason}`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            const errEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${user.username} kullanıcısını yasaklayamazsın.`);

            await interaction.reply({ embeds: [errEmbed] });
        }
    }
}
