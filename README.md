# German "Ortsnetzbereiche" as geojson

Data from [Bundesnetzagentur "Orts­netz­be­rei­che, Orts­netz­kenn­zah­len und Orts­netz­be­reichs­gren­zen"](https://www.bundesnetzagentur.de/SharedDocs/Downloads/DE/Sachgebiete/Telekommunikation/Unternehmen_Institutionen/Nummerierung/Rufnummern/ONVerzeichnisse/ONBGrenzen/1ONB-Grenzen-2021.html), but as geojson instead of ArcView shapefiles.

Contains shapes of all local network areas (german: Ortsnetzbereiche) with their
respective area codes (german: Vorwahl).

Note: Area codes don't include the leading `0`.

## [Direct Download](https://github.com/railslove/german-onb-geojson/raw/master/onb.geojson)

## Install via npm

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

**Update data with one command:**

```
npm run check-update
```

**Alternative: do it manually**

- Unzip and put the contents of "ONB-Grenzen.zip" inside the "raw" directory
- Run `./convert.sh`
- Add and commit with `Update data to yyyy-mm-dd`

### Publish to npm

```
npm run release
```

## Author

[Timo Mämecke](https://github.com/timomeh)

## License

[MIT](./license)

---

<p align="center">with 💚 by Railslove</p>
