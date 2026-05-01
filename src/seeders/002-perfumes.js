'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');

        const [brands] = await queryInterface.sequelize.query(
            `SELECT brand_id, name FROM brands;`
        );
        const brandMap = {};
        brands.forEach(b => brandMap[b.name] = b.brand_id);

        const perfumesData = [
            // Mancera
            {
                brand: 'Mancera',
                name: 'Amore Caffe',
                description: 'Amore Caffe - парфюмерная чашка кофе с наслаждением: горьковатый аккорд чёрного кофе смягчается сладостью взбитых сливок, амаретто и ванили, создавая округлый, уютный и чувственный образ.',
                gender: 'unisex',
                concentration: 'Eau de Parfum',
                image_url: '/images/perfumes/mancera/amore-caffe.webp',
                perfume_category: 'восточные гурманские',
                volumes: [{ volume_ml: 60, price: 16048 }]
            },
            {
                brand: 'Mancera',
                name: 'Xplicit Vanilla',
                description: 'Xplicit Vanilla - тёмная, плотская ваниль из Мексики, опьяняющая и чувственная. Землистая глубина, согретая редкими древесными нотами, дымком уда и бархатом тростникового сахара, на кремовом сандаловом основании.',
                gender: 'unisex',
                concentration: 'Eau de Parfum',
                image_url: '/images/perfumes/mancera/xplicit-vanilla.jpg',
                perfume_category: 'восточные гурманские',
                volumes: [{ volume_ml: 60, price: 16048 }]
            },
            {
                brand: 'Mancera',
                name: 'Cherry Cherry',
                description: 'Cherry Cherry - утончённый аромат тёмной вишни с бергамотом. Пудровые ирис и жасмин, таинственные пачули, на базе тёплого гелиотропа, бархатной ванили и чувственного мускуса.',
                gender: 'unisex',
                concentration: 'Eau de Parfum',
                image_url: '/images/perfumes/mancera/cherry-cherry.webp',
                perfume_category: 'восточные цветочные',
                volumes: [{ volume_ml: 60, price: 16048 }]
            },

            // Montale
            {
                brand: 'Montale',
                name: 'Arabians Tonka',
                description: 'Arabians Tonka - пряно-анималистическая ода арабским скакунам: грациозное переплетение розы, бобов тонка и бергамота на фоне дерзкого уда и амбры, с лёгким, колоритным налётом женственности.',
                gender: 'unisex',
                concentration: 'Eau de Parfum',
                image_url: '/images/perfumes/montale/arabians-tonka.webp',
                perfume_category: 'восточные древесные',
                volumes: [{ volume_ml: 100, price: 23900 }]
            },
            {
                brand: 'Montale',
                name: 'Chocolate Greedy',
                description: 'Chocolate Greedy - игривый аромат-каприз, созданный для истинных любителей дорогого изысканного шоколада. Бобы тонка слегка приправленные апельсинами, ванилью и сушенными фруктами делают его невероятно чувственным и глубоким.',
                gender: 'unisex',
                concentration: 'Eau de Parfum',
                image_url: '/images/perfumes/montale/chocolate-greedy100.webp',
                perfume_category: 'гурманские',
                volumes: [
                    { volume_ml: 100, price: 20900 },
                    { volume_ml: 50, price: 14028 }
                ]
            },
            {
                brand: 'Montale',
                name: 'Wild Pears',
                description: 'Фруктовый аромат Wild Pears с ярким бергамотом и сочной грушей разбавлен нежной гвоздикой, ландышем и чувственным мускусом.',
                gender: 'unisex',
                concentration: 'Eau de Parfum',
                image_url: '/images/perfumes/montale/wild-pears.webp',
                perfume_category: 'фужерные фруктовые',
                volumes: [{ volume_ml: 50, price: 13130 }]
            },
            {
                brand: 'Montale',
                name: 'Herbal Aquatica',
                description: 'Herbal Aquatica - ароматическое плавание по Нилу: умиротворяющая смесь трав и цветов лотоса с древесной теплотой. Свежие брызги воды, вечерняя прохлада и сияние заката в одной уникальной композиции.',
                gender: 'unisex',
                concentration: 'Eau de Parfum',
                image_url: '/images/perfumes/montale/herbal-aquatica100.webp',
                perfume_category: 'фужерные свежие',
                volumes: [
                    { volume_ml: 100, price: 23068 },
                    { volume_ml: 50, price: 14137 }
                ]
            },

            // Tiziana Terenzi
            {
                brand: 'Tiziana Terenzi',
                name: 'Kirké',
                description: 'Kirké - чувственный золотой эликсир богини Цирцеи, где сочная фруктовая феерия маракуйи и персика ложится на тёплый шлейф ванили, сандала и мускуса, создавая ауру утончённого волшебства.',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/tiziana-terenzi/kirke.webp',
                perfume_category: 'шипровые фруктовые',
                volumes: [{ volume_ml: 100, price: 23375 }]
            },
            {
                brand: 'Tiziana Terenzi',
                name: 'Kirké Overdose',
                description: 'Kirké Overdose - божественная ода волшебнице Цирцее: усиленная магия культового парфюма. Сочный взрыв маракуйи, персика и малины с розой ведёт к тайному саду ландыша, гардении и жасмина, завершаясь магнетической базой пачули, сандала, ванили и амбры - нерушимая волшебная печать.',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/tiziana-terenzi/kirke-overdose.webp',
                perfume_category: 'шипровые фруктовые',
                volumes: [{ volume_ml: 100, price: 35700 }]
            },
            {
                brand: 'Tiziana Terenzi',
                name: 'Cassiopea',
                description: 'Cassiopea - воздушная белая эссенция из лунной коллекции: тонкие ноты маракуйи и чёрной смородины, закреплённые силой цветов донника, лилии и нарцисса. Аромат, способный по волшебству перенести из реальности в воображение, подобно путешествию к звёздам.',
                gender: 'female',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/tiziana-terenzi/cassiopea.webp',
                perfume_category: 'шипровые цветочные',
                volumes: [{ volume_ml: 100, price: 30600 }]
            },
            {
                brand: 'Tiziana Terenzi',
                name: 'Moro di Venezia',
                description: 'Moro di Venezia - приглашение в душу Венеции: взрывная свежесть цитрусов и сочных фруктов ведёт к цветочному сердцу фиалки и жасмина. Морская амбра и древесные аккорды с ванильной теплотой создают аромат, что чувствует город как живое существо.',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/tiziana-terenzi/moro-di-venezia.webp',
                perfume_category: 'фруктовые цветочные',
                volumes: [{ volume_ml: 100, price: 34000 }]
            },
            {
                brand: 'Tiziana Terenzi',
                name: 'Foconero',
                description: 'Foconero - вечерний бриз, застывший во времени: солнечные цитрусы Сорренто встречаются с пряными травами и лекарственной прохладой. Иланг-иланг и ландыш в объятиях морской соли, переходящие в благородное древесное эхо кедра, сандала и пачулей.',
                gender: 'male',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/tiziana-terenzi/foconero.webp',
                perfume_category: 'фужерные водяные',
                volumes: [{ volume_ml: 100, price: 23375 }]
            },
            {
                brand: 'Tiziana Terenzi',
                name: 'Leo',
                description: 'Leo - парфюмерный автопортрет Паоло Теренци через призму его знака зодиака: солнечные цитрусы символизируют щедрость Льва, гипнотические цветы - его харизму, а могучая древесная база - непоколебимую целостность и талант к лидерству.',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/tiziana-terenzi/leo.webp',
                perfume_category: 'фруктовые цветочные',
                volumes: [{ volume_ml: 100, price: 30600 }]
            },
            {
                brand: 'Tiziana Terenzi',
                name: 'Gumin',
                description: 'Ароматы из юбилейной коллекции Gumin предназначены тем, кто любит выделяться строгим, но решительным стилем, уникальным и изысканным, ярким, но не эгоцентричным. Раскрываются щедрой гармонией цитрусовых итальянских садов, залитых солнцем.',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/tiziana-terenzi/gumin.webp',
                perfume_category: 'фруктовые цветочные',
                volumes: [{ volume_ml: 100, price: 38800 }]
            },

            // V Canto
            {
                brand: 'V Canto',
                name: 'Mandragola',
                description: 'Mandragola - тёмное зелье средневекового афродизиака: итальянский шафран и цитрусы сменяются дымным удом и чайной розой, даря владельцу опасную, гипнотическую неотразимость.',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/v-canto/mandragola.webp',
                perfume_category: 'восточные древесные',
                volumes: [{ volume_ml: 100, price: 19200 }]
            },
            {
                brand: 'V Canto',
                name: 'Arkano della Fortuna',
                description: 'Arkano della Fortuna - ольфакторный талисман удачи из коллекции Arkani: шипучий каскад калабрийских цитрусов с бергамотом и мандарином ведёт к лавандовому спокойствию и царственной амбре. Глубокая база мускуса, толуанского бальзама, франжипани и берёзы создаёт защитную ауру процветания и веры в мечты.',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/v-canto/arkano-della-fortuna.webp',
                perfume_category: 'цитрусовые фужерные',
                volumes: [{ volume_ml: 100, price: 22000 }]
            },
            {
                brand: 'V Canto',
                name: 'Ricina',
                description: 'Ricina - роковая красота в парфюмерной форме, вдохновлённая ядовитым рицинусом Лукреции Борджиа: сладкие фрукты персика и сливы с энергией сицилийских цитрусов ведут к пьянящим цветам апельсина, жасмина и ириса. Богатые древесные тона пачулей, уда, сандала и дубового мха создают гипнотический аромат для безотказного соблазнения.',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/v-canto/ricina.webp',
                perfume_category: 'цветочные древесно-мускусные',
                volumes: [{ volume_ml: 100, price: 29200 }]
            },
            {
                brand: 'V Canto',
                name: 'Lucrethia',
                description: 'Lucrethia - смертоносное зелье для femme fatale, вдохновлённое Лукрецией Борджиа: соблазнительные ноты груши, цветов лайма с розовым перцем ведут к опьяняющему жасмину. Волшебный шлейф кофе, какао, занзибарской гвоздики, экзотических древесных нот со сладкими смолами и мадагаскарской ванилью создаёт гипнотическую ловушку.',
                gender: 'female',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/v-canto/lucrethia.webp',
                perfume_category: 'восточные цветочные',
                volumes: [{ volume_ml: 100, price: 19200 }]
            },

            // New Notes
            {
                brand: 'New Notes',
                name: 'Felina',
                description: 'Felina - гурманский аромат дикой и необузданной натуры: съедобная симфония кокоса, молока, ванили, корицы, кофе и шоколада переходит в пряное сердце можжевельника, ладана, табака и карамели. Сандал, ваниль, амбра и мускус в базе создают пудрово-сладкий шлейф для ночных приключений.',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/new-notes/felina.webp',
                perfume_category: 'восточные гурманские',
                volumes: [{ volume_ml: 60, price: 16640 }]
            },
            {
                brand: 'New Notes',
                name: 'Latte Di Cherry',
                description: 'Latte Di Cherry - изысканный фруктовый коктейль, погружающий в эйфорию: сочная вишня и красные ягоды со сладким апельсином и миндальным молоком ведут к пьянящему букету турецкой розы, жасмина и иланг-иланга со специями. Сливочный шлейф ванили, бобов тонка, сандала, амбры и мускуса создаёт ощущение вкусного коктейля «через трубочку».',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/new-notes/latte-di-cherry.webp',
                perfume_category: 'фруктовые цветочные',
                volumes: [{ volume_ml: 50, price: 15720 }]
            },
            {
                brand: 'New Notes',
                name: 'Cocktail Maracuja',
                description: 'Cocktail Maracuja - экзотический аперитив для предвкушения ночи: сочный аккорд маракуйи, чёрной смородины, груши и клубники с засахаренным лимоном ведёт к цветочному буйству розы, жасмина, кардамона и имбиря. Насыщенный сливочный шлейф ванили, лактонных нот, амбры и мускуса сочится, «капая на кончик языка».',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/new-notes/cocktail-maracuja.webp',
                perfume_category: 'фруктовые свежие',
                volumes: [{ volume_ml: 50, price: 15720 }]
            },
            {
                brand: 'New Notes',
                name: 'Erotika Maximale',
                description: 'Erotika Maximale - очаровательное продолжение дерзкой композиции Erotika Minimale. Опьяняющий и дерзкий аромат, созданный для того, чтобы пробуждать страсть, очарование и непреодолимую чувственность.',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/new-notes/erotika-maximale.webp',
                perfume_category: 'восточные древесные',
                volumes: [{ volume_ml: 60, price: 19840 }]
            },
            {
                brand: 'New Notes',
                name: 'Erotika Minimale',
                description: 'Erotika Minimale - тонкая чувственность в минималистичной форме: интригующее начало корицы и кориандра, цветочный шёпот розы и ириса с гераныо, мягкая база сливочной амбры и мускуса. Классический аккорд, превращающийся в соблазнительное, уютное послевкусие.',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/new-notes/erotika-minimale.webp',
                perfume_category: 'восточные гурманские',
                volumes: [{ volume_ml: 50, price: 14800 }]
            },
            {
                brand: 'New Notes',
                name: 'Caramelo Vanilla',
                description: 'Caramelo Vanilla - сладкая ольфакторная симфония ванили и карамели: вкусные аккорды сахарной ваты и сгущённого молока, усложнённые бархатной гурманикой и экзотическим франжипани. Тягучий шлейф бобов тонка, ванили и мускуса создаёт истинное искушение для обонятельных рецепторов.',
                gender: 'unisex',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/new-notes/caramelo-vanilla.webp',
                perfume_category: 'фруктовые цветочные',
                volumes: [{ volume_ml: 50, price: 15720 }]
            },

            // Dolce & Gabbana
            {
                brand: 'Dolce & Gabbana',
                name: 'Light Blue Capri In Love Pour Homme',
                description: 'Light Blue Capri In Love Pour Homme - магнетический аромат солёного бриза Капри: пряный старт чёрного перца, сердце из каприйского зелёного инжира с фруктовой сладостью, элегантная база пачули. Флакон в стиле каприйской майолики воплощает очарование средиземноморского острова.',
                gender: 'male',
                concentration: 'Eau de Parfum',
                image_url: '/images/perfumes/dolce-gabbana/light-blue-capri-in-love-pour-homme.webp',
                perfume_category: 'древесные фужерные',
                volumes: [{ volume_ml: 50, price: 11814 }]
            },
            {
                brand: 'Dolce & Gabbana',
                name: 'K by Dolce&Gabbana Parfum',
                description: 'K by Dolce&Gabbana Parfum - выражение силы и страсти современного мужчины: смелый аккорд лакрицы, сладкая эссенция карамелизированного инжира в сердце, тёплое сандаловое дерево в базе. Древесно-пряная композиция, раскрывающая неотразимую сущность.',
                gender: 'male',
                concentration: 'Extrait de Parfum',
                image_url: '/images/perfumes/dolce-gabbana/k-by-dolce-gabbana-parfum.webp',
                perfume_category: 'восточные гурманские',
                volumes: [
                    { volume_ml: 50, price: 12555 },
                    { volume_ml: 100, price: 17118 }
                ]
            },
            {
                brand: 'Dolce & Gabbana',
                name: 'The One for Men',
                description: 'The One for Men - аромат для харизматичного джентльмена: классическая древесно-пряная композиция с грейпфрутом, кориандром и базиликом в начале, кардамоном, имбирём и цветами апельсина в сердце, табаком, кедром и амброй в шлейфе. Минималистичный флакон отражает элегантность и высокий статус.',
                gender: 'male',
                concentration: 'Eau de Toilette',
                image_url: '/images/perfumes/dolce-gabbana/the-one-for-men-edt.webp',
                perfume_category: 'древесные пряные',
                volumes: [
                    { volume_ml: 50, price: 10170 },
                    { volume_ml: 100, price: 13896 },
                    { volume_ml: 150, price: 19035 }
                ]
            },
            {
                brand: 'Dolce & Gabbana',
                name: 'Devotion Intense',
                description: 'Devotion Intense - гурманское дополнение коллекции Devotion от Dolce&Gabbana: интенсивная версия с цветком апельсина и ванилью, обогащённая выразительными нотами лесного ореха. Аромат, прославляющий итальянское мастерство, в флаконе из янтарного стекла с символом Sacred Heart.',
                gender: 'female',
                concentration: 'Eau de Parfum',
                image_url: '/images/perfumes/dolce-gabbana/devotion-intense-10ml.webp',
                perfume_category: 'цветочные пряные',
                volumes: [
                    { volume_ml: 10, price: 4563 },
                    { volume_ml: 30, price: 10476 },
                    { volume_ml: 50, price: 14940 },
                    { volume_ml: 100, price: 20124 }
                ]
            },
            {
                brand: 'Dolce & Gabbana',
                name: 'Light Blue',
                description: 'Light Blue - воплощение легкости Средиземноморья: свежая композиция с сицилийским лимоном и яблоком Гренни Смит на фоне соблазнительного кедра. Аромат солнца, морского бриза и звуков волн Капри в элегантном флаконе с амальфитанской керамикой.',
                gender: 'female',
                concentration: 'Eau de Toilette',
                image_url: '/images/perfumes/dolce-gabbana/light-blue-edt-10ml.webp',
                perfume_category: 'цветочные фруктовые',
                volumes: [
                    { volume_ml: 10, price: 4149 },
                    { volume_ml: 30, price: 8820 },
                    { volume_ml: 100, price: 16596 }
                ]
            },

            // Givenchy
            {
                brand: 'Givenchy',
                name: 'L’Interdit Eau de Parfum',
                description: 'Современная классика для дерзкой женщины: белые цветы, апельсиновый цвет, пачули и ваниль создают элегантный и смелый шлейф.',
                gender: 'female',
                concentration: 'Eau de Parfum',
                image_url: '/images/perfumes/givenchy/linterdit-edp.webp',
                perfume_category: 'восточные цветочные',
                volumes: [
                    { volume_ml: 35, price: 9760 },
                    { volume_ml: 50, price: 13675 },
                    { volume_ml: 80, price: 16775 }
                ]
            },
            {
                brand: 'Givenchy',
                name: 'Ange Ou Demon Le Secret',
                description: 'Ange Ou Demon Le Secret - парфюмерное воплощение женской дуальности от Givenchy: искрящаяся свежесть клюквы, лимона и чая с чувственным жасмином и палисандром. Секретный аромат, позволяющий женщине быть одновременно и Ангелом, и Демоном.',
                gender: 'female',
                concentration: 'Eau de Parfum',
                image_url: '/images/perfumes/givenchy/ange-ou-demon-le-secret.webp',
                perfume_category: 'цветочные',
                volumes: [
                    { volume_ml: 30, price: 9200 },
                    { volume_ml: 50, price: 13675 },
                    { volume_ml: 80, price: 17900 }
                ]
            },
            {
                brand: 'Givenchy',
                name: 'Gentleman Society',
                description: 'Gentleman Society - многогранный мужской аромат Givenchy: свежий старт можжевельника и кардамона с шалфеем, сердце из дикого нарцисса и ириса, соблазнительная база ветивера, ванили, сандала и кедра. Таинственный древесный аккорд, воплощающий уникальное мастерство бренда.',
                gender: 'male',
                concentration: 'Eau de Parfum',
                image_url: '/images/perfumes/givenchy/gentleman-society.webp',
                perfume_category: 'древесные фужерные',
                volumes: [
                    { volume_ml: 60, price: 12100 },
                    { volume_ml: 100, price: 15980 }
                ]
            },

        ];

        for (const perfume of perfumesData) {
            // Вставляем парфюм и получаем ID
            const [perfumeResult] = await queryInterface.sequelize.query(
                `INSERT INTO perfumes (brand_id, name, description, gender, concentration, image_url, perfume_category, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING perfume_id;`,
                {
                    replacements: [
                        brandMap[perfume.brand],
                        perfume.name,
                        perfume.description,
                        perfume.gender,
                        perfume.concentration,
                        perfume.image_url,
                        perfume.perfume_category,
                        new Date(),
                        new Date()
                    ],
                    type: Sequelize.QueryTypes.INSERT
                }
            );

            const perfumeId = perfumeResult[0].perfume_id;

            // Подготавливаем volumes для вставки
            const volumes = perfume.volumes.map(v => ({
                perfume_id: perfumeId,
                volume_ml: v.volume_ml,
                price: v.price,
                created_at: new Date(),
                updated_at: new Date()
            }));

            // Вставляем volumes
            if (volumes.length > 0) {
                await queryInterface.bulkInsert('perfume_volumes', volumes);
            }
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        await queryInterface.bulkDelete('perfume_volumes', null, {});
        await queryInterface.bulkDelete('perfumes', null, {});
    }
};