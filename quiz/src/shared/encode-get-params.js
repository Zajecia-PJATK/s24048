// https://stackoverflow.com/a/50288717/7132461
export const encodeGetParams = p => Object
    .entries(p)
    .map(kv => kv
        .map(encodeURIComponent)
        .join("=")
    )
    .join("&");
