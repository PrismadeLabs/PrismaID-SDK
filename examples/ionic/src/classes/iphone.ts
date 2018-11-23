export class IPhone {

    public static getModel(width: number, height: number, wpr: number) {
        return IPhone.models.find((model) => (model.width === width && model.heights.indexOf(height) !== -1 && model.wpr === wpr))
    }

    public static isVersion(version: string, width: number, height: number, wpr: number) {
        const model = IPhone.getModel(width, height, wpr)
        let index = -1
        if (model) {
            index = model.versions.indexOf(version)
        }

        return index !== -1
    }

    // tslint:disable:object-literal-sort-keys
    private static readonly models = [
        {
            width: 375,
            heights: [
                635,
                768,
                812,
            ],
            dpi: 458,
            wpr: 3,
            wprnative: 3,
            versions: [
                "iPhoneX",
                "iPhoneXS",
            ],
        },
        {
            width: 414,
            heights: [
                719,
                852,
                896,
            ],
            dpi: 458,
            wpr: 3,
            wprnative: 3,
            versions: [
                "iPhoneXSMax",
            ],
        },
        {
            width: 414,
            heights: [
                719,
                852,
                896,
            ],
            dpi: 326,
            wpr: 2,
            wprnative: 2,
            versions: [
                "iPhoneXR",
            ],
        },
        {
            width: 414,
            heights: [
                622,
                716,
                736,
            ],
            dpi: 401,
            wpr: 3,
            wprnative: 2.6,
            versions: [
                "iPhone6+",
                "iPhone6S+",
                "iPhone7+",
                "iPhone8+",
            ],
        },
        {
            width: 375,
            heights: [
                553,
                647,
                667,
            ],
            dpi: 326,
            wpr: 2,
            wprnative: 2,
            versions: [
                "iPhone6",
                "iPhone6S",
                "iPhone7",
                "iPhone8",
            ],
        },
    ]
    // tslint:enable:object-literal-sort-keys
}
