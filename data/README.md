# Data specs

For all CSV files, data will be recognized by keys in the header row, not by order of columns. That means they can contain any unknown columns just for human-readable memo or comment.

> [!IMPORTANT]
> Be sure to run `npm run import` before run the app, to import these data to SQLite dabatabase.

## `${yyyy}.csv`

Source for events table.

| id    | date       | starts_at | venue_name         | location_id | company_name    | title    | duration_min | paid |
| ----- | ---------- | --------- | ------------------ | ----------: | --------------- | -------- | -----------: | ---- |
| 23001 | 2023/08/04 | 13:00     | 飯田文化会館ホール |           1 | 人形劇団example | なかよし |           30 |      |

## `locations.csv`

Source for `locations` table. Data must be:

- Normalized based on geographical location (not for each rooms or halls in one location)
- Common for all years

|  id | name         | addr                                     | lat        | lon         |
| --: | ------------ | ---------------------------------------- | ---------- | ----------- |
|   1 | 飯田文化会館 | 〒395-0051 長野県飯田市高羽町５丁目５−１ | 35.5243521 | 137.8196711 |

## `venues.csv`

Source for `venues` table. It will be used to normalization of each venue name in events table.

| name               | location     | location_id |
| ------------------ | ------------ | ----------: |
| 飯田文化会館ホール | 飯田文化会館 |           1 |
| 飯田文化会館2F     | 飯田文化会館 |           1 |
| 飯田文化会館1F     | 飯田文化会館 |           1 |
