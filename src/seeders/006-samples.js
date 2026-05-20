'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        const [perfumes] = await queryInterface.sequelize.query(
            `SELECT perfume_id, name FROM perfumes;`
        );
        const perfumeMap = {};
        perfumes.forEach(p => perfumeMap[p.name] = p.perfume_id);

        const [existingSamples] = await queryInterface.sequelize.query(
            `SELECT perfume_id, volume_ml FROM samples;`
        );

        const existingSet = new Set(existingSamples.map(s => `${s.perfume_id}_${s.volume_ml}`));
        const perfumeNames = [
            'Amore Caffe', 'Xplicit Vanilla', 'Cherry Cherry',
            'Arabians Tonka', 'Chocolate Greedy', 'Wild Pears', 'Herbal Aquatica',
            'Kirké', 'Kirké Overdose', 'Cassiopea', 'Moro di Venezia', 'Foconero', 'Leo', 'Gumin',
            'Mandragola', 'Arkano della Fortuna', 'Ricina', 'Lucrethia',
            'Felina', 'Latte Di Cherry', 'Cocktail Maracuja', 'Erotika Maximale', 'Erotika Minimale', 'Caramelo Vanilla',
            'Light Blue Capri In Love Pour Homme', 'K by Dolce&Gabbana Parfum', 'The One for Men', 'Devotion Intense', 'Light Blue',
            'L’Interdit Eau de Parfum', 'Ange Ou Demon Le Secret', 'Gentleman Society'
        ];

        const samplesToInsert = [];
        const volumes = [1.5, 2.0, 2.5];

        perfumeNames.forEach(name => {
            const perfumeId = perfumeMap[name];
            if (perfumeId) {
                volumes.forEach(vol => {
                    if (!existingSet.has(`${perfumeId}_${vol}`)) {
                        samplesToInsert.push({
                            perfume_id: perfumeId,
                            volume_ml: vol,
                            stock: vol === 1.5 ? 100 : (vol === 2.0 ? 70 : 50),
                        });
                    }
                });
            }
        });

        if (samplesToInsert.length > 0) {
            await queryInterface.bulkInsert('samples', samplesToInsert, {});
            console.log(`Добавлено новых сэмплов: ${samplesToInsert.length}`);
        } else {
            console.log('Все сэмплы уже есть в базе, ничего не добавлено.');
        }
    },

    async down(queryInterface, Sequelize) {

    }
};