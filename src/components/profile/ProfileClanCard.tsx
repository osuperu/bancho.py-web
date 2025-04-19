import { Typography } from "@mui/material"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

import { UserClan } from "../../adapters/bpy-api/user"

export const ProfileClanCard = ({ clan }: { clan: UserClan }) => {
  return (
    <>
      <Stack direction="row" spacing={1}>
        <Box
          component="img"
          width={70}
          height={70}
          borderRadius={2}
          src={clan.icon ?? "https://a.akatsuki.gg/default"}
        />
        <Stack direction="column" justifyContent="center">
          <Typography variant="h6">Clan</Typography>
          <Typography variant="body1">{clan.name}</Typography>
        </Stack>
      </Stack>
    </>
  )
}
