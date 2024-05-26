const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sil')
        .setDescription('Belirtilen sayıda mesajı siler.')
        .addIntegerOption(option =>
            option.setName('miktar')
                .setDescription('Silinecek mesaj sayısını belirtin.')
                .setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('miktar');

        if (amount <= 0 || amount > 100) {
            return interaction.reply({ content: 'Lütfen 1 ile 100 arasında bir sayı girin.', ephemeral: true });
        }

        try {
            const fetched = await interaction.channel.messages.fetch({ limit: amount });
            interaction.channel.bulkDelete(fetched);
            interaction.reply({ content: `${amount} adet mesaj başarıyla silindi.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Mesajları silerken bir hata oluştu.', ephemeral: true });
        }
    },
};
