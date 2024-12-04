# Advent of Code 2024

## Project Setup

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository
2. Run `npm install`

### Running Solutions
To run a specific day's solution:
```bash
npm run day <day_number> <part_number> [test]
```

- `<day_number>`: The day of the challenge (e.g., 1 for Day 1).
- `<part_number>`: The part of the challenge (e.g., 1 for Part 1).
- `[test]`: Optional flag to use the test input

#### Example:
To run Day 1, Part 1 with actual data:
```bash
npm run day 1 1
```

To run Day 1, Part 2 with test data:
```bash
npm run day 1 2 test
```

### Project Structure
- `src/utils/`: Shared utility functions
- `src/days/`: Individual day solutions
- Each day folder contains:
  - `part1.ts`: Solution file for Part 1
  - `part2.ts`: Solution file for Part 2
  - `test-input.txt`: Test input

Note that in order to run the solutions, you will need to add your puzzle input to an `input.txt` file in each day's folder.

## Utilities
Utility functions are available in `src/utils/` to help with common tasks like:
- Reading input files
- Parsing inputs
- Basic calculations