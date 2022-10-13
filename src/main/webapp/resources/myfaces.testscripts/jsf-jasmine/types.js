/**
 * replacement for the $ operator of jquery
 * Domquery does not have s
 * @type {(selector: string) => DomQuery}
 */
let D$ = DomQuery.querySelectorAll;