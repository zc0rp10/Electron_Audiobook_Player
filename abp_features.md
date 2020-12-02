# Features

## High

- ~~Kom ihåg var man slutade senast.~~
- ~~Justera uppspelningshastighet.~~
- ~~Filtrera efter Läst, Oläst, Påbörjad.~~
- ~~Sortera biblioteket efter olika kriterier, typ alfabetiskt.~~
- ~~Volym Slider~~
- ~~Lägga till en bok bestånde av flera ljudfiler.~~
- ~~Keyboard Shortcuts, pause/play, scrub fram/bak, volym upp/ned, playback rate +/- and ,/.~~
- ~~Möjlighet att justera titlar, author etc, på bokobjekten för att snygga till eventuell skit metadata~~
- ~~Varning/Begäran om bekräftelse om man försöker lägga till en bok med ett namn som redan finns.~~
- ~~Sovtimer, pausa om 1,2,3h eller nästa kapitel etc.~~

## Medium

- ~~Chapter lista med möjlighet att hoppa till chapter.~~
- Möjlighet att kommentera/notera vid vissa tidpunker, som ett bokmärke om det är något man vill komma ihåg etc.
- Fetch synopsis på boken från en databas någonstans. Extern source visade sig vara svårt, då de flesta public API kräver auth med personlig api key ~~//Finns faktist ofta description i bokmetadatan.~~
- Möjlighet att skapa grupper att organisera böckerna efter. T.ex författare, samma bok serie.
- Bevakar en eller flera mappar efter att ljudböcker 'läggs till', uppdaterar automatiskt i bililoteket.

## Low

- ~~"Komihåg" volym funktion.~~
- Skapa en riktig popup modul som informerar om att boken redan finns.
- Drag and drop, in ny bok
- Synca App Settings/Bibliotekets innehåll till Gdrive (eller Firebase?)
- Möjlighet att "köa" böcker.
- Ladda in pdf etc för att att läsa med i boken

### Nödvändigt?

- Låt användaren lägga till flera stödda filformat själv? / Alla ljudformat nutida och framtida kommer sannorlikt fungera med audio objektet. Enda anledningen till filtreringen är i samband med att man lägger till en mapp, så att inte andra filtyper tas med i playlist.

### Settings

- ~~Color Themes~~
- Tutorial, Nollställa till visa igen
- ~~Keyboard Shortcuts~~

### Bugs

- ~~Generera unique ID alt använde filepath some bookID igen istället. Risk att det inte finns title i fil och då blir det undefined som id.~~
- ~~Playrate respekteras inte när nytt chapter läses in.~~
- Upplösning wonky på 2k. Cover och Chaper Select större än des panel.
