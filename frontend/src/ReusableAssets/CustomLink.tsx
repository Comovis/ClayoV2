import { Link as RouterLink } from "react-router-dom"

// This component replaces Next.js Link with React Router's Link
const Link = ({ href, children, ...props }) => {
  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  )
}

export default Link
