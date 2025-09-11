
import { ReactNode } from 'react';
import { Grid, Box } from "@mui/material"

interface TwoColumnLayoutProps {
  title?: ReactNode
  leftContent?: ReactNode
  rightContent?: ReactNode
}

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({ title, leftContent, rightContent }) => {
  return (
    <Grid container>
      {title && (
        <Grid item xs={12}>
          <Box>{title}</Box>
        </Grid>
      )}
      <Grid item sm={6} xs={12}>
        {leftContent}
      </Grid>
      <Grid item sm={6} xs={12}>
        {rightContent}
      </Grid>
    </Grid>
  )
}

export default TwoColumnLayout