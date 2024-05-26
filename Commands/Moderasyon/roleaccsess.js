const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rol')
        .setDescription('Belirli bir role üye verme veya alma işlemi.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Role verilecek veya alınacak üyeyi seçin.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('action')
                .setDescription('İşlem türünü seçin (ver veya al).')
                .setRequired(true)
                .addChoices(
                    { name: 'Ver', value: 'give' },
                    { name: 'Al', value: 'remove' }
                ))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Verilecek veya alınacak rolü seçin.')
                .setRequired(true)),
    async execute(interaction) {
        const authorizedRoleId = '1243569762173325404'; // Yetkili rol ID
        const allowedRoles = ['1243569848844554290', '1243569795283288105', '1243569850404569201']; // Verilebilecek rollerin ID'leri
        const logChannelId = '1243354914923741315'; // Bildirim kanalı ID

        const member = interaction.member;

        if (!member.roles.cache.has(authorizedRoleId)) {
            return interaction.reply({ content: "Bu komutu kullanma yetkiniz yok.", ephemeral: true });
        }

        const user = interaction.options.getMember('user');
        const action = interaction.options.getString('action');
        const role = interaction.options.getRole('role');

        if (!allowedRoles.includes(role.id)) {
            return interaction.reply({ content: "Bu rolü verme veya alma yetkiniz yok.", ephemeral: true });
        }

        try {
            let embed;
            const otherRoleId = allowedRoles.find(r => r !== role.id);

            if (action === 'give') {
                await user.roles.add(role);
                embed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`${user} kullanıcısına ${role.name} rolü verildi. İşlemi yapan: ${interaction.user.tag}`)
                    .setTimestamp();

                if (user.roles.cache.has(otherRoleId)) {
                    await user.roles.remove(otherRoleId);
                }
            } else if (action === 'remove') {
                await user.roles.remove(role);
                embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`${user} kullanıcısından ${role.name} rolü alındı. İşlemi yapan: ${interaction.user.tag}`)
                    .setTimestamp();
            }

            await interaction.reply({ embeds: [embed], ephemeral: true });

            const logChannel = interaction.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                await logChannel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'İşlem başarısız oldu.', ephemeral: true });
        }
    },
};
