import { useIdentityContext } from "../context/Identity"

export const SupportPage = () => {
  const { identity } = useIdentityContext()

  if (identity === null) {
    return <>Please sign into your account first!</>
  }

  return <></>
}
