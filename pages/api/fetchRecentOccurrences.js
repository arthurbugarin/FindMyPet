export default function handler(req, res) {
  res.status(200).json({
    occurrences: [ 
      {
        id: 0,
        petName: 'Saul Goodboy',
        author: 'Saul Goodman',
        lat: 0,
        lon: 0,
        description: 'good boy',
        lost: 0,
        timestamp: 0,
      },
      {
        id: 1,
        petName: 'Sabrina Goodgirl',
        author: 'Saul Goodman',
        lat: 0,
        lon: 0,
        description: 'good girl',
        lost: 0,
        timestamp: 0,
      }
    ]
  })
}
