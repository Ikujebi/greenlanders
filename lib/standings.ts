import Fixture from '../models/Fixture'
import Team from '../models/Team'
// import mongoose from 'mongoose'


export type Row = {
teamId: string
name: string
played: number
wins: number
draws: number
losses: number
gf: number
ga: number
gd: number
points: number
}


export async function computeStandings(): Promise<Row[]> {
const teams = await Team.find()
const fixtures = await Fixture.find({ status: 'played' })


const map = new Map<string, Row>()
teams.forEach(t => {
map.set(t._id.toString(), {
teamId: t._id.toString(),
name: t.name,
played: 0,
wins: 0,
draws: 0,
losses: 0,
gf: 0,
ga: 0,
gd: 0,
points: 0
})
})


fixtures.forEach(f => {
const home = map.get(f.homeTeamId.toString())!
const away = map.get(f.awayTeamId.toString())!
const hs = f.homeScore ?? 0
const as = f.awayScore ?? 0


home.played++
away.played++
home.gf += hs
home.ga += as
away.gf += as
away.ga += hs


if (hs > as) {
home.wins++
home.points += 3
away.losses++
} else if (hs < as) {
away.wins++
away.points += 3
home.losses++
} else {
home.draws++
away.draws++
home.points++
away.points++
}
})


const rows = Array.from(map.values())
rows.forEach(r => (r.gd = r.gf - r.ga))


rows.sort((a, b) => {
if (b.points !== a.points) return b.points - a.points
if (b.gd !== a.gd) return b.gd - a.gd
return b.gf - a.gf
})


return rows
}