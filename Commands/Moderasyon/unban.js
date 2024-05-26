const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// Yetkililerin ID'lerini burada tanımla
const yetkiliRolIDs = ['1243569763486007386'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Bir üyenin yasağını kaldır')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('Yasağı kaldırılacak kullanıcının ID bilgisi')
                .setRequired(true)
        ),

    async execute(interaction) {
        const { options, guild, member } = interaction;
        const userId = options.getString('userid');

        // Eğer komutu kullanan kişinin yetkisi yoksa işlem yapma
        if (!member.roles.cache.some(role => yetkiliRolIDs.includes(role.id))) {
            const errEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription("Bu komutu kullanmaya yetkiniz yok.");

            return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }

        try {
            await guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setColor('Purple')
                .setDescription(`${userId} kullanıcısının yasağı kaldırıldı.`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            const errEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`Geçerli bir ID giriniz.`);

            await interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}
