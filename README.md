# German "Orstnetzbereiche" as geojson

Data from [Bundesnetzagentur "Orts­netz­be­rei­che, Orts­netz­kenn­zah­len und Orts­netz­be­reichs­gren­zen"](https://www.bundesnetzagentur.de/DE/Sachgebiete/Telekommunikation/Unternehmen_Institutionen/Nummerierung/Rufnummern/ONRufnr/ON_Einteilung_ONB/ON_ONB_ONKz_ONBGrenzen_Basepage.html), but as geojson instead of ArcView shapefiles.

Contains shapes of all local network areas (german: Ortsnetzbereiche) with their
respective area codes (german: Vorwahl).

Note: Area codes don't include the leading `0`.

## Install

```sh
npm install german-onb-geojson
```

## Usage

Access the file directly through the `node_modules` directory:

```
./node_modules/german-onb-geojson/onb.geojson
```

## Contribute (Update data)

- Requirements: ogr2ogr from [GDAL](https://gdal.org/)
- Put the contents of "ONB-Grenzen.zip" inside the "raw" directory
- Run `./convert.sh`

### Publish to npm

- `npm version <update_type>`
- `npm publish`

Or use: https://github.com/sindresorhus/np

## License

[MIT](./license)

---

<p align="center">with 💚 from Railslove</p>
