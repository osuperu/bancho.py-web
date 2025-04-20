import {
  Avatar,
  Box,
  Container,
  Grid,
  GridLegacy,
  Stack,
  TablePagination,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { fetchUsersFriends, UserResponse } from "../adapters/bpy-api/user"
import StaticPageBanner from "../components/images/banners/static_page_banner.svg"
import { UserFriendsIcon } from "../components/images/icons/UserFriendsIcon"

const PAGE_SIZE = 21

const UserFriendCard = ({ friend }: { friend: UserResponse }) => {
  return (
    <GridLegacy key={friend.id} item xs={12} sm={4} p={1}>
      <Link
        to={`/u/${friend.id}`}
        // eslint-disable-next-line react/forbid-component-props
        style={{
          color: "#FFFFFF",
          textDecoration: "none",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          p={2}
          border="1px solid #211D35"
          borderRadius={4}
        >
          <Avatar
            alt="user-avatar"
            src={`${process.env.REACT_APP_BPY_AVATARS_BASE_URL}/${friend.id}`}
            variant="circular"
            sx={{ width: 36, height: 36 }}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Typography variant="h5">{friend.username}</Typography>
            {/* {friend.is_mutual ? (
              <Tooltip title="Mutual friend">
                <FavoriteIcon sx={{ color: "#cc4499" }} />
              </Tooltip>
            ) : null} */}
          </Stack>
        </Stack>
      </Link>
    </GridLegacy>
  )
}

export const UserFriendsPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [page, setPage] = useState(0)
  const [userFriends, setUserFriends] = useState<UserResponse[]>([])

  useEffect(() => {
    ;(async () => {
      let userFriends
      try {
        userFriends = await fetchUsersFriends({
          page: page + 1,
          pageSize: PAGE_SIZE,
        })
      } catch (e: any) {
        console.error(e)
        return
      }
      setUserFriends(userFriends ?? [])
    })()
  }, [page])

  return (
    <>
      <Box
        height={{ xs: 0, sm: 340 }}
        sx={{
          backgroundSize: "cover",
          backgroundImage: `url(${StaticPageBanner})`,
        }}
      />
      <Container maxWidth="md" sx={{ mt: isMobile ? 0 : -20 }}>
        <Stack direction="column" borderRadius={4}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              backgroundSize: "cover",
              backgroundImage: `url(${StaticPageBanner})`,
            }}
            py={5}
          >
            <Stack direction="column" alignItems="center">
              <Box width={22} height={22}>
                <UserFriendsIcon />
              </Box>
              <Typography variant="h5">Friends</Typography>
            </Stack>
          </Box>
          <Box bgcolor="#191527">
            <Grid container>
              {userFriends.map((friend: UserResponse) => (
                <UserFriendCard key={friend.id} friend={friend} />
              ))}
            </Grid>
            <TablePagination
              component={Box}
              sx={{ background: "#191527" }}
              count={-1}
              rowsPerPage={PAGE_SIZE}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPageOptions={[]}
              labelDisplayedRows={({ from, to }) => {
                return `Results ${from}-${to}`
              }}
            />
          </Box>
        </Stack>
      </Container>
    </>
  )
}
