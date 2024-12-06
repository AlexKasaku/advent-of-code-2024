import { readdir, stat } from 'node:fs/promises'

/**
 * Downloads inputs for all existing day folders, in case they have been cleared.
 */
const restoreDays = async () => {
  const baseDir = './src' // Your base directory
  const dayPattern = /^day-(\d{2})$/ // Regex to match folders like day-01, day-02, ..., day-31
  const inputFolders: string[] = []

  // Read the src directory
  const days = await readdir(baseDir)

  // Filter for day-XX folders
  for (const day of days) {
    const dayPath = `${baseDir}/${day}`

    if (dayPattern.test(day)) {
      const inputsDir = `${dayPath}/inputs`

      // Check if the inputs directory exists and is a directory
      // eslint-disable-next-line no-await-in-loop
      const stats = await stat(inputsDir)
      if (stats.isDirectory()) {
        // Implement restoring here
      }
    }
  }

  return inputFolders // Return all found input folder paths
}

restoreDays()
