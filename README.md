# Тестовое задание от Grid Dynamics (by Igor Bezmestin)

Резюме - [http://igorbezmestin.ru](http://igorbezmestin.ru)

Почта - [igor-rock@list.ru](mailto://igor-rock@list.ru), [igorbezmestin@gmail.com](mailto://igorbezmestin@gmail.com)

VK - [vk.com/igorbezmestin](https://vk.com/igorbezmestin)

Телеграмм - [@BezmestinIY](https://t.me/BezmestinIY)

---

## Запуск проекта

При помощи npm:

``` bash
# установить зависимости
npm i

# запуск сервера в режиме dev (разработки) (по-умолчанию, сервер расположен по адресу localhost:8080)
npm run dev

# билд проекта
npm run build

```

Либо при помощи yarn:

``` bash
# установить зависимости
yarn install

# запуск сервера в режиме dev (разработки) (по-умолчанию, сервер расположен по адресу localhost:8080)
yarn dev

# билд проекта
yarn build

```
Для просмотра итогового проекта перейдите по ссылке [http://testGD.igorbezmestin.ru](http://testGD.igorbezmestin.ru)

## Структура папок и файлов

```
├── dist/                         # Билд проекта
├── src/                          # Исходники
│   ├── components/               # Vue-компоненты
│   │   ├── parts/                # Более мелкие компоненты
│   │   ├── sections/             # Основные компоненты (sections)
│   │   └── interfaceIphoneX.vue  # Базовый компонент
│   ├── data/                     # Данные в формате JSON
│   │    └── users.json           # Контакты (см. ниже)
│   ├── fonts/                    # Используемые шрифты (OpenSans)
│   ├── helpers/                  # Часто используемые вспомогательные функции
│   │   ├── historyItems.js       # Преобразование даты звонков
│   │   ├── sort.js               # Сортировка массивов (по имени и дате звонков)
│   │   ├── transform.js          # Преобразования номера телефона
│   │   ├── urls.js               # URL изображений (по-умолчанию)
│   ├── images/                   # Папка для хранения изображений
│   │   └── icons/                # SVG-иконки
│   ├── store/                    # Vuex-хранилище
│   │   ├── modules/              # Модули хранилища
│   │   │   └── urls.js           # Хранилище обработки контактов
│   │   └── index.js              # Настройки хранилища
│   ├── styles/                   # Стили (PostCSS)
│   │   ├── blocks/               # Стили отдельных компонентов
│   │   ├── layout/               # Базовые стили проекта
│   │   └── main.pcss             # Файл порядка подключения стилей
│   ├── App.vue                   # Основной компонент Vue
│   ├── index.pug                 # Основной файл верстки
│   └── main.js                   # Основной файл подключаемых модулей и настройки проекта
├── .babelrc                      # Конфигурация Babel
├── .editorconfig                 # Конфигурация настроек редактора кода
├── .gitignore                    # Список исключённых файлов (из Git)
├── package.json                  # Список зависимостей и прочей информации проекта
├── postcss.config.js             # Настройки PostCSS (макс. приближен к SASS)
├── readme.md                     # Документация проекта
└── webpack.conf.js               # Конфигурация Webpack.js

```
## Структура данных о контакте в файле users.json

```
...
{
    "id": 3,                                  # ID контакта
    "name": "John",                           # Имя контакта
    "lastName": "Doe",                        # Фамилия контакта
    "phoneNumber": "+79485164385",            # Телефонный номер контакта
    "dateOfBirth": "10/30/1991",              # Дата рожения контакта
    "userpic": "URL контакта",                # URL аватарки контакта
    "outgoing": [                             # Массив исходящий звонков
        {
            "quantity": "105",                # Количество исходящих звонков
            "dateTime": "2010-04-16T10:50:50" # Дата исходящих звонков (YYYY-MM-DDTHH:MM:SS)
        },
        ...
...
```

## Основной используемый стек

* Webpack
* PostCSS + normalize.css
* PUG
* Vue + Vuex + Simple Vue Validator
* Yarn, npm
