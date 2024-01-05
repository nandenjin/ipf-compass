export const getYYYYMMDD = (date: Date) =>
  `${date.getFullYear()}-${('00' + (date.getMonth() + 1)).slice(-2)}-${(
    '00' + date.getDate()
  ).slice(-2)}`

export const getHHMM = (date: Date) =>
  `${date.getHours()}:${('00' + date.getMinutes()).slice(-2)}`

export const formatDate = (date: Date, format: string) =>
  format
    .replace(/YYYY/g, date.getFullYear().toString())
    .replace(/MM/g, (date.getMonth() + 1).toString())
    .replace(/DD/g, date.getDate().toString())
    .replace(/hh/g, date.getHours().toString())
    .replace(/mm/g, ('00' + date.getMinutes()).slice(-2))
