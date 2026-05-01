'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        //получение id ароматов
        const [perfumes] = await queryInterface.sequelize.query(
            `SELECT perfume_id, name FROM perfumes;`
        );
        const perfumeMap = {};
        perfumes.forEach(p => perfumeMap[p.name] = p.perfume_id);

        //ноты для каждого аромата
        await queryInterface.bulkInsert('perfume_notes', [
            // Amore Caffe
            { perfume_id: perfumeMap['Amore Caffe'], note_name: 'Кофе' },
            { perfume_id: perfumeMap['Amore Caffe'], note_name: 'Амаретто' },
            { perfume_id: perfumeMap['Amore Caffe'], note_name: 'Мороженое' },
            { perfume_id: perfumeMap['Amore Caffe'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Amore Caffe'], note_name: 'Амбра' },

            // Xplicit Vanilla
            { perfume_id: perfumeMap['Xplicit Vanilla'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Xplicit Vanilla'], note_name: 'Шоколад' },
            { perfume_id: perfumeMap['Xplicit Vanilla'], note_name: 'Сандал' },
            { perfume_id: perfumeMap['Xplicit Vanilla'], note_name: 'Бобы тонка' },
            { perfume_id: perfumeMap['Xplicit Vanilla'], note_name: 'Амбра' },
            { perfume_id: perfumeMap['Xplicit Vanilla'], note_name: 'Бензоин' },

            // Cherry Cherry
            { perfume_id: perfumeMap['Cherry Cherry'], note_name: 'Черная вишня' },
            { perfume_id: perfumeMap['Cherry Cherry'], note_name: 'Лимон' },
            { perfume_id: perfumeMap['Cherry Cherry'], note_name: 'Бергамот' },
            { perfume_id: perfumeMap['Cherry Cherry'], note_name: 'Гелиотроп' },
            { perfume_id: perfumeMap['Cherry Cherry'], note_name: 'Пачули' },
            { perfume_id: perfumeMap['Cherry Cherry'], note_name: 'Уд' },
            { perfume_id: perfumeMap['Cherry Cherry'], note_name: 'Мускус' },
            { perfume_id: perfumeMap['Cherry Cherry'], note_name: 'Ваниль' },

            // Arabians Tonka
            { perfume_id: perfumeMap['Arabians Tonka'], note_name: 'Роза' },
            { perfume_id: perfumeMap['Arabians Tonka'], note_name: 'Бобы тонка' },
            { perfume_id: perfumeMap['Arabians Tonka'], note_name: 'Бергамот' },
            { perfume_id: perfumeMap['Arabians Tonka'], note_name: 'Амбра' },
            { perfume_id: perfumeMap['Arabians Tonka'], note_name: 'Уд' },
            { perfume_id: perfumeMap['Arabians Tonka'], note_name: 'Мускус' },
            { perfume_id: perfumeMap['Arabians Tonka'], note_name: 'Сандал' },

            // Chocolate Greedy 
            { perfume_id: perfumeMap['Chocolate Greedy'], note_name: 'Какао' },
            { perfume_id: perfumeMap['Chocolate Greedy'], note_name: 'Шоколад' },
            { perfume_id: perfumeMap['Chocolate Greedy'], note_name: 'Апельсин' },
            { perfume_id: perfumeMap['Chocolate Greedy'], note_name: 'Бобы тонка' },
            { perfume_id: perfumeMap['Chocolate Greedy'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Chocolate Greedy'], note_name: 'Сухофрукты' },
            { perfume_id: perfumeMap['Chocolate Greedy'], note_name: 'Мускатный орех' },

            // Wild Pears  
            { perfume_id: perfumeMap['Wild Pears'], note_name: 'Груша' },
            { perfume_id: perfumeMap['Wild Pears'], note_name: 'Бергамот' },
            { perfume_id: perfumeMap['Wild Pears'], note_name: 'Гвоздика' },
            { perfume_id: perfumeMap['Wild Pears'], note_name: 'Ландыш' },
            { perfume_id: perfumeMap['Wild Pears'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['Wild Pears'], note_name: 'Мускус' },
            { perfume_id: perfumeMap['Wild Pears'], note_name: 'Амбра' },
            { perfume_id: perfumeMap['Wild Pears'], note_name: 'Ваниль' },

            // Herbal Aquatica  
            { perfume_id: perfumeMap['Herbal Aquatica'], note_name: 'Лотос' },
            { perfume_id: perfumeMap['Herbal Aquatica'], note_name: 'Шалфей' },
            { perfume_id: perfumeMap['Herbal Aquatica'], note_name: 'Папирус' },
            { perfume_id: perfumeMap['Herbal Aquatica'], note_name: 'Морские ноты' },
            { perfume_id: perfumeMap['Herbal Aquatica'], note_name: 'Зелёные ноты' },
            { perfume_id: perfumeMap['Herbal Aquatica'], note_name: 'Сандал' },
            { perfume_id: perfumeMap['Herbal Aquatica'], note_name: 'Мускус' },
            { perfume_id: perfumeMap['Herbal Aquatica'], note_name: 'Амбра' },

            // Kirké (Tiziana Terenzi)
            { perfume_id: perfumeMap['Kirké'], note_name: 'Маракуйя' },
            { perfume_id: perfumeMap['Kirké'], note_name: 'Персик' },
            { perfume_id: perfumeMap['Kirké'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Kirké'], note_name: 'Сандал' },
            { perfume_id: perfumeMap['Kirké'], note_name: 'Мускус' },
            { perfume_id: perfumeMap['Kirké'], note_name: 'Амбра' },
            { perfume_id: perfumeMap['Kirké'], note_name: 'Бензоин' },

            // Kirké Overdose (Tiziana Terenzi)
            { perfume_id: perfumeMap['Kirké Overdose'], note_name: 'Маракуйя' },
            { perfume_id: perfumeMap['Kirké Overdose'], note_name: 'Персик' },
            { perfume_id: perfumeMap['Kirké Overdose'], note_name: 'Малина' },
            { perfume_id: perfumeMap['Kirké Overdose'], note_name: 'Роза' },
            { perfume_id: perfumeMap['Kirké Overdose'], note_name: 'Ландыш' },
            { perfume_id: perfumeMap['Kirké Overdose'], note_name: 'Гардения' },
            { perfume_id: perfumeMap['Kirké Overdose'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['Kirké Overdose'], note_name: 'Пачули' },
            { perfume_id: perfumeMap['Kirké Overdose'], note_name: 'Сандал' },
            { perfume_id: perfumeMap['Kirké Overdose'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Kirké Overdose'], note_name: 'Амбра' },

            // Cassiopea (Tiziana Terenzi)
            { perfume_id: perfumeMap['Cassiopea'], note_name: 'Маракуйя' },
            { perfume_id: perfumeMap['Cassiopea'], note_name: 'Чёрная смородина' },
            { perfume_id: perfumeMap['Cassiopea'], note_name: 'Донник' },
            { perfume_id: perfumeMap['Cassiopea'], note_name: 'Лилия' },
            { perfume_id: perfumeMap['Cassiopea'], note_name: 'Нарцисс' },
            { perfume_id: perfumeMap['Cassiopea'], note_name: 'Мускус' },
            { perfume_id: perfumeMap['Cassiopea'], note_name: 'Амбра' },

            // Moro di Venezia (Tiziana Terenzi)
            { perfume_id: perfumeMap['Moro di Venezia'], note_name: 'Бергамот' },
            { perfume_id: perfumeMap['Moro di Venezia'], note_name: 'Грейпфрут' },
            { perfume_id: perfumeMap['Moro di Venezia'], note_name: 'Чёрная смородина' },
            { perfume_id: perfumeMap['Moro di Venezia'], note_name: 'Ананас' },
            { perfume_id: perfumeMap['Moro di Venezia'], note_name: 'Фиалка' },
            { perfume_id: perfumeMap['Moro di Venezia'], note_name: 'Ландыш' },
            { perfume_id: perfumeMap['Moro di Venezia'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['Moro di Venezia'], note_name: 'Амбра' },
            { perfume_id: perfumeMap['Moro di Venezia'], note_name: 'Кипарис' },
            { perfume_id: perfumeMap['Moro di Venezia'], note_name: 'Дубовый мох' },
            { perfume_id: perfumeMap['Moro di Venezia'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Moro di Venezia'], note_name: 'Мускус' },

            // Foconero (Tiziana Terenzi)
            { perfume_id: perfumeMap['Foconero'], note_name: 'Лимон' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Бергамот' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Тимьян' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Можжевельник' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Лаванда' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Иланг-иланг' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Ландыш' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Гиацинт' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Кардамон' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Морская соль' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Кедр' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Дубовый мох' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Сандал' },
            { perfume_id: perfumeMap['Foconero'], note_name: 'Пачули' },

            // Leo (Tiziana Terenzi)
            { perfume_id: perfumeMap['Leo'], note_name: 'Апельсин' },
            { perfume_id: perfumeMap['Leo'], note_name: 'Кумкват' },
            { perfume_id: perfumeMap['Leo'], note_name: 'Бергамот' },
            { perfume_id: perfumeMap['Leo'], note_name: 'Мандарин' },
            { perfume_id: perfumeMap['Leo'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['Leo'], note_name: 'Роза' },
            { perfume_id: perfumeMap['Leo'], note_name: 'Фиалка' },
            { perfume_id: perfumeMap['Leo'], note_name: 'Магнолия' },
            { perfume_id: perfumeMap['Leo'], note_name: 'Бобы тонка' },
            { perfume_id: perfumeMap['Leo'], note_name: 'Мускус' },

            // Gumin (Tiziana Terenzi)
            { perfume_id: perfumeMap['Gumin'], note_name: 'Мандарин' },
            { perfume_id: perfumeMap['Gumin'], note_name: 'Бергамот' },
            { perfume_id: perfumeMap['Gumin'], note_name: 'Апельсин' },
            { perfume_id: perfumeMap['Gumin'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['Gumin'], note_name: 'Фиалка' },
            { perfume_id: perfumeMap['Gumin'], note_name: 'Роза' },
            { perfume_id: perfumeMap['Gumin'], note_name: 'Амбра' },
            { perfume_id: perfumeMap['Gumin'], note_name: 'Сандал' },
            { perfume_id: perfumeMap['Gumin'], note_name: 'Уд' },
            { perfume_id: perfumeMap['Gumin'], note_name: 'Мускус' },
            { perfume_id: perfumeMap['Gumin'], note_name: 'Бобы тонка' },
            { perfume_id: perfumeMap['Gumin'], note_name: 'Ваниль' },

            // Mandragola (V Canto)
            { perfume_id: perfumeMap['Mandragola'], note_name: 'Шафран' },
            { perfume_id: perfumeMap['Mandragola'], note_name: 'Цитрусовые ноты' },
            { perfume_id: perfumeMap['Mandragola'], note_name: 'Чайная роза' },
            { perfume_id: perfumeMap['Mandragola'], note_name: 'Уд' },
            { perfume_id: perfumeMap['Mandragola'], note_name: 'Дубовый мох' },
            { perfume_id: perfumeMap['Mandragola'], note_name: 'Пачули' },
            { perfume_id: perfumeMap['Mandragola'], note_name: 'Ладан' },
            { perfume_id: perfumeMap['Mandragola'], note_name: 'Амбра' },

            // Arkano della Fortuna (V Canto)
            { perfume_id: perfumeMap['Arkano della Fortuna'], note_name: 'Бергамот' },
            { perfume_id: perfumeMap['Arkano della Fortuna'], note_name: 'Мандарин' },
            { perfume_id: perfumeMap['Arkano della Fortuna'], note_name: 'Лимон' },
            { perfume_id: perfumeMap['Arkano della Fortuna'], note_name: 'Лаванда' },
            { perfume_id: perfumeMap['Arkano della Fortuna'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['Arkano della Fortuna'], note_name: 'Амбра' },
            { perfume_id: perfumeMap['Arkano della Fortuna'], note_name: 'Мускус' },
            { perfume_id: perfumeMap['Arkano della Fortuna'], note_name: 'Толуанский бальзам' },
            { perfume_id: perfumeMap['Arkano della Fortuna'], note_name: 'Франжипани' },
            { perfume_id: perfumeMap['Arkano della Fortuna'], note_name: 'Берёза' },

            // Ricina (V Canto)
            { perfume_id: perfumeMap['Ricina'], note_name: 'Персик' },
            { perfume_id: perfumeMap['Ricina'], note_name: 'Слива' },
            { perfume_id: perfumeMap['Ricina'], note_name: 'Бергамот' },
            { perfume_id: perfumeMap['Ricina'], note_name: 'Апельсин' },
            { perfume_id: perfumeMap['Ricina'], note_name: 'Цветы апельсина' },
            { perfume_id: perfumeMap['Ricina'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['Ricina'], note_name: 'Ирис' },
            { perfume_id: perfumeMap['Ricina'], note_name: 'Пачули' },
            { perfume_id: perfumeMap['Ricina'], note_name: 'Уд' },
            { perfume_id: perfumeMap['Ricina'], note_name: 'Сандал' },
            { perfume_id: perfumeMap['Ricina'], note_name: 'Дубовый мох' },
            { perfume_id: perfumeMap['Ricina'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Ricina'], note_name: 'Мускус' },

            // Lucrethia (V Canto)
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Груша' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Цветы лайма' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Розовый перец' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Горький апельсин' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Кофе' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Какао' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Гвоздика' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Кедр' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Пачули' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Бензоин' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Амбра' },
            { perfume_id: perfumeMap['Lucrethia'], note_name: 'Мускус' },

            // New Notes Felina
            { perfume_id: perfumeMap['Felina'], note_name: 'Кокос' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Молоко' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Корица' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Кофе' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Карамель' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Шоколад' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Можжевельник' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Ладан' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Бобы тонка' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Табак' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Сандал' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Амбра' },
            { perfume_id: perfumeMap['Felina'], note_name: 'Мускус' },

            // New Notes Latte Di Cherry
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Вишня' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Красные ягоды' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Апельсин' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Миндаль' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Турецкая роза' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Иланг-иланг' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Специи' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Бобы тонка' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Ветивер' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Сандал' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Амбра' },
            { perfume_id: perfumeMap['Latte Di Cherry'], note_name: 'Мускус' },

            // New Notes Cocktail Maracuja
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Маракуйя' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Чёрная смородина' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Груша' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Клубника' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Засахаренный лимон' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Роза' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Кардамон' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Имбирь' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Корица' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Розовый перец' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Лактонные ноты' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Амбра' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Мускус' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Пачули' },
            { perfume_id: perfumeMap['Cocktail Maracuja'], note_name: 'Кедр' },

            // New Notes Erotika Maximale
            { perfume_id: perfumeMap['Erotika Maximale'], note_name: 'Мандарин' },
            { perfume_id: perfumeMap['Erotika Maximale'], note_name: 'Шафран' },
            { perfume_id: perfumeMap['Erotika Maximale'], note_name: 'Ирис' },
            { perfume_id: perfumeMap['Erotika Maximale'], note_name: 'Фиалка' },
            { perfume_id: perfumeMap['Erotika Maximale'], note_name: 'Лабданум' },
            { perfume_id: perfumeMap['Erotika Maximale'], note_name: 'Анималистичные ноты' },
            { perfume_id: perfumeMap['Erotika Maximale'], note_name: 'Сандал' },
            { perfume_id: perfumeMap['Erotika Maximale'], note_name: 'Кедр' },
            { perfume_id: perfumeMap['Erotika Maximale'], note_name: 'Кашемир' },
            { perfume_id: perfumeMap['Erotika Maximale'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Erotika Maximale'], note_name: 'Бензоин' },
            { perfume_id: perfumeMap['Erotika Maximale'], note_name: 'Мускус' },

            // New Notes Erotika Minimale
            { perfume_id: perfumeMap['Erotika Minimale'], note_name: 'Корица' },
            { perfume_id: perfumeMap['Erotika Minimale'], note_name: 'Кориандр' },
            { perfume_id: perfumeMap['Erotika Minimale'], note_name: 'Роза' },
            { perfume_id: perfumeMap['Erotika Minimale'], note_name: 'Ирис' },
            { perfume_id: perfumeMap['Erotika Minimale'], note_name: 'Герань' },
            { perfume_id: perfumeMap['Erotika Minimale'], note_name: 'Амбра' },
            { perfume_id: perfumeMap['Erotika Minimale'], note_name: 'Мускус' },

            // New Notes Caramelo Vanilla
            { perfume_id: perfumeMap['Caramelo Vanilla'], note_name: 'Сахарная вата' },
            { perfume_id: perfumeMap['Caramelo Vanilla'], note_name: 'Сгущённое молоко' },
            { perfume_id: perfumeMap['Caramelo Vanilla'], note_name: 'Карамель' },
            { perfume_id: perfumeMap['Caramelo Vanilla'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Caramelo Vanilla'], note_name: 'Франжипани' },
            { perfume_id: perfumeMap['Caramelo Vanilla'], note_name: 'Бобы тонка' },
            { perfume_id: perfumeMap['Caramelo Vanilla'], note_name: 'Мускус' },


            // Dolce & Gabbana Devotion Intense 
            { perfume_id: perfumeMap['Devotion Intense'], note_name: 'Цветок апельсина' },
            { perfume_id: perfumeMap['Devotion Intense'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Devotion Intense'], note_name: 'Лесной орех' },

            // Dolce & Gabbana Light Blue Capri In Love Pour Homme
            { perfume_id: perfumeMap['Light Blue Capri In Love Pour Homme'], note_name: 'Чёрный перец' },
            { perfume_id: perfumeMap['Light Blue Capri In Love Pour Homme'], note_name: 'Зелёный инжир' },
            { perfume_id: perfumeMap['Light Blue Capri In Love Pour Homme'], note_name: 'Пачули' },
            { perfume_id: perfumeMap['Light Blue Capri In Love Pour Homme'], note_name: 'Мускус' },
            { perfume_id: perfumeMap['Light Blue Capri In Love Pour Homme'], note_name: 'Древесные ноты' },

            // Dolce & Gabbana Light Blue
            { perfume_id: perfumeMap['Light Blue'], note_name: 'Сицилийский лимон' },
            { perfume_id: perfumeMap['Light Blue'], note_name: 'Яблоко Гренни Смит' },
            { perfume_id: perfumeMap['Light Blue'], note_name: 'Кедр' },
            { perfume_id: perfumeMap['Light Blue'], note_name: 'Бамбук' },
            { perfume_id: perfumeMap['Light Blue'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['Light Blue'], note_name: 'Голубой мускус' },

            // Dolce & Gabbana The One for Men
            { perfume_id: perfumeMap['The One for Men'], note_name: 'Грейпфрут' },
            { perfume_id: perfumeMap['The One for Men'], note_name: 'Кориандр' },
            { perfume_id: perfumeMap['The One for Men'], note_name: 'Базилик' },
            { perfume_id: perfumeMap['The One for Men'], note_name: 'Кардамон' },
            { perfume_id: perfumeMap['The One for Men'], note_name: 'Имбирь' },
            { perfume_id: perfumeMap['The One for Men'], note_name: 'Цветы апельсина' },
            { perfume_id: perfumeMap['The One for Men'], note_name: 'Табак' },
            { perfume_id: perfumeMap['The One for Men'], note_name: 'Кедр' },
            { perfume_id: perfumeMap['The One for Men'], note_name: 'Амбра' },

            // Dolce & Gabbana K by Dolce&Gabbana Parfum
            { perfume_id: perfumeMap['K by Dolce&Gabbana Parfum'], note_name: 'Лакрица' },
            { perfume_id: perfumeMap['K by Dolce&Gabbana Parfum'], note_name: 'Карамелизированный инжир' },
            { perfume_id: perfumeMap['K by Dolce&Gabbana Parfum'], note_name: 'Сандаловое дерево' },
            { perfume_id: perfumeMap['K by Dolce&Gabbana Parfum'], note_name: 'Ветивер' },
            { perfume_id: perfumeMap['K by Dolce&Gabbana Parfum'], note_name: 'Пихта' },
            { perfume_id: perfumeMap['K by Dolce&Gabbana Parfum'], note_name: 'Мускус' },

            // Givenchy Ange Ou Demon Le Secret (все объёмы)
            { perfume_id: perfumeMap['Ange Ou Demon Le Secret'], note_name: 'Клюква' },
            { perfume_id: perfumeMap['Ange Ou Demon Le Secret'], note_name: 'Лимон' },
            { perfume_id: perfumeMap['Ange Ou Demon Le Secret'], note_name: 'Зелёный чай' },
            { perfume_id: perfumeMap['Ange Ou Demon Le Secret'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['Ange Ou Demon Le Secret'], note_name: 'Палисандр' },
            { perfume_id: perfumeMap['Ange Ou Demon Le Secret'], note_name: 'Белый мускус' },

            // Givenchy Gentleman Society (все объёмы)
            { perfume_id: perfumeMap['Gentleman Society'], note_name: 'Можжевельник' },
            { perfume_id: perfumeMap['Gentleman Society'], note_name: 'Кардамон' },
            { perfume_id: perfumeMap['Gentleman Society'], note_name: 'Шалфей' },
            { perfume_id: perfumeMap['Gentleman Society'], note_name: 'Дикий нарцисс' },
            { perfume_id: perfumeMap['Gentleman Society'], note_name: 'Ирис' },
            { perfume_id: perfumeMap['Gentleman Society'], note_name: 'Ветивер' },
            { perfume_id: perfumeMap['Gentleman Society'], note_name: 'Ваниль' },
            { perfume_id: perfumeMap['Gentleman Society'], note_name: 'Сандал' },
            { perfume_id: perfumeMap['Gentleman Society'], note_name: 'Кедр' },
            { perfume_id: perfumeMap['Gentleman Society'], note_name: 'Амбра' },

            // Givenchy L'Interdit (все объёмы)
            { perfume_id: perfumeMap['L’Interdit Eau de Parfum'], note_name: 'Цветы апельсина' },
            { perfume_id: perfumeMap['L’Interdit Eau de Parfum'], note_name: 'Жасмин' },
            { perfume_id: perfumeMap['L’Interdit Eau de Parfum'], note_name: 'Тубероза' },
            { perfume_id: perfumeMap['L’Interdit Eau de Parfum'], note_name: 'Пачули' },
            { perfume_id: perfumeMap['L’Interdit Eau de Parfum'], note_name: 'Ветивер' },
            { perfume_id: perfumeMap['L’Interdit Eau de Parfum'], note_name: 'Амброксан' },
            { perfume_id: perfumeMap['L’Interdit Eau de Parfum'], note_name: 'Бензоин' },
            { perfume_id: perfumeMap['L’Interdit Eau de Parfum'], note_name: 'Ваниль' },
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        await queryInterface.bulkDelete('perfume_notes', null, {});
    }
};