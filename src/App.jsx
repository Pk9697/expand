import { useEffect } from 'react'
import { useState } from 'react'

const rows = 17
const cols = 17
const dx = [-1, -1, 0, 1, 1, 1, 0, -1]
const dy = [0, 1, 1, 1, 0, -1, -1, -1]
const initialGrid = new Array(rows * cols).fill('black')

function App() {
	const [grid, setGrid] = useState([...initialGrid])
	const [currId, setCurrId] = useState(null)

	const resetGrid = () => {
		setGrid([...initialGrid])
	}

	const ripple = (queue = []) => {
		resetGrid()
		setGrid((prev) => {
			return prev.map((item, idx) => (queue.includes(idx) ? 'red' : item))
		})
	}

	// Timeout function
	const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

	useEffect(() => {
		if (!currId) return
		let mounted=true

		const bfs = async () => {
			const queue = []
			queue.push(currId)
			let vis = new Array(rows * cols).fill(false)
			vis[currId] = true
			while (queue.length) {
				if (!mounted) return
				let times = queue.length
				while (times--) {
					const curr = queue.shift()
					const x = Math.floor(curr / rows)
					const y = curr % cols

					for (let i = 0; i < 8; ++i) {
						let newX = x + dx[i]
						let newY = y + dy[i]
						const new1dIdx = newX * rows + newY
						if (
							newX >= 0 &&
							newX < rows &&
							newY >= 0 &&
							newY < cols &&
							!vis[new1dIdx]
						) {
							vis[new1dIdx] = true
							queue.push(new1dIdx)
						}
					}
				}
				ripple(queue)
				if (queue.length === 0) {
					queue.push(currId)
					vis = new Array(rows * cols).fill(false)
					vis[currId] = true
				}
				await timeout(1000)
			}
		}

		bfs()

		return () => {
			mounted=false
		}
	}, [currId])

	const handleClick = (idx) => {
		resetGrid()
		setCurrId(idx)
	}

	return (
		<div className='grid-container'>
			{grid.map((item, idx) => (
				<div
					key={idx}
					className='grid-item'
					onClick={() => handleClick(idx)}
					style={{ backgroundColor: item }}
				></div>
			))}
		</div>
	)
}

export default App
