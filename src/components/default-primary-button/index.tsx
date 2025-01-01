import { Button } from '@mui/material'
import React from 'react'

interface PrimaryDefaulButtonProps {
  text: string
  props?: React.ComponentProps<typeof Button>
}

const DefaultPrimaryButton: React.FC<PrimaryDefaulButtonProps> = ({
  text,
  props,
}) => {
  return (
    <Button variant="contained" color="primary" {...props}>
      {text}
    </Button>
  )
}

export default DefaultPrimaryButton
