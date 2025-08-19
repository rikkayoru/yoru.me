import { cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { afterEach } from 'vitest'

export const user = userEvent.setup()

afterEach(() => {
  cleanup()
})
