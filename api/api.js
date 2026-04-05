import axios from 'axios'

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL })

export const calculateGraduation = (courses, settings) =>
  client.post('/graduation/calculate', { courses, ...settings })
    .then(res => res.data)