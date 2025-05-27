
# Internationalization

First things first, thank you for even making it to this page. It makes me super happy and surprised to know that there are people who would want to translate LLocal in there own llocal (haha) language. So a massive thank you from the bottom of my heart.

## How to add translations?

### Create Locale Directory

```bash
 mkdir resources/locales/<locale-code>
```

- Make sure you follow the format `language-dialect` for example `en-uk`.
- `lanugage_dialect` would not work

> For more information on locale name format [follow this format](https://www.i18next.com/principles/translation-resolution#example-1)!

### Copy translations from `en` locale

```bash
cp resources/locales/en/translations.json resources/locales/<locale-code>

```
> Note: The above command only works on unix shells, for windows you can use `copy` instead of `cp`

### Update the values (Not the key)

- Update the values in the key-value and not the key itself. The key is necessary for retrieval of the actual translation since it is used to invoke the translation function.
- To make translations easier you can use a portal like [ this ]( https://translate.i18next.com/ )!

### Finally update the i18n.ts

- This file resides in `src/main/lib/localization/i18n.ts`
- Add the `locale-code` to the `fallbackLng` array.

Code snippet of the same:

```typescript
    {
      fallbackLng: ['en'], // i18n.languages returns this instead of supportedLngs, which is pretty cool
    }
```

### Test your changes

You can follow [this readme](https://github.com/kartikm7/llocal/tree/master#project-setup) to setup LLocal
