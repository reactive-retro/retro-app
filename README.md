qson
====

Reads QR codes that have a URL in them, and expects a JSON response formatted like this example:

```
{
    data: {
        ImageKey: {
            type: "picture",
            data: "base64 encoded image string",
            subdata: "jpeg"
        },
        HeaderKey: {
            type: "text",
            data: "Some Person",
            subdata: "Some Subdued Text"
        },
        AvatarKey: {
            type: "picture"
            data: "base64 encoded image string",
            subdata: "png"
        },
        ActionKey: {
            type: "action",
            subtype: "call",
            data: "Call Person",
            subdata: "1234567890"
        },
        TextKey: {
            type: "text",
            data: "Person Name",
            subdata: "Person Date of Birth"
        },
        TitleKey: {
            type: "text",
            data: "List Title"
        }
    },

    display: [
        {
            cardType: "glance",
            image: "ImageKey",
            header: "HeaderKey",
            avatar: "AvatarKey",
            footerActions: [
                "ActionKey"
            ],
            footerTexts: [
                "TextKey"
            ]
        },
        {
            cardType: "list",
            title: "TitleKey",
            data: [
                "LiteralString",
                "LiteralString2"
            ]
        }
    ]
}
```

Data Objects
============

Data Objects (eg, those in `data`) have this general format:

```
{
    type (required)
    subtype
    data (required)
    subdata
}
```

* `type` is one of `picture`, `text`, `action`, or `list`.

* `subtype` currently only applies to `action`, and it can be `email` or `call`. The contact information is stored in `subdata`.

* `data` and `subdata` are arbitrary strings. `subdata` only currently applies to `text`, `action`, and `picture`. For `text` it is some subdued text shown beneath. For `picture` it is the image type (ie, `png`, or `jpeg`). `action` is described above.

Card Objects
============

Card Objects (eg, those in `display`) vary in format based on the card type. Currently, there are two card types: `glance` and `list`.

`glance` follows this format:

```
{
    cardType (required)
    image
    header
    avatar
    footerActions
    footerTexts
}
```

* `cardType` is `"glance"`.
* `image` is a key to a Data Object (with the type `picture`).
* `header` is a key to a Data Object (with the type `text`).
* `avatar` is a key to a Data Object (with the type `picture`).
* `footerActions` is an array of keys to Data Objects (with the type `action`).
* `footerTexts` is an array of keys to Data Objects (with the type `text`).

`list` follows this format:

```
{
    cardType (required)
    title
    data
}
```

* `cardType` is `"list"`.
* `title` is an arbitrary string.
* `data` is a key to a Data Object (with the type `list`).