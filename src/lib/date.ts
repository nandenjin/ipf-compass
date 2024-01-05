export const getYYYYMMDD = (date: Date) =>
  `${date.getFullYear()}-${('00' + (date.getMonth() + 1)).slice(-2)}-${(
    '00' + date.getDate()
  ).slice(-2)}`

export const getHHMM = (date: Date) =>
  `${date.getHours()}:${('00' + date.getMinutes()).slice(-2)}`
