import { useState, useEffect } from "react"

const useCrud = (apiClient) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchItems()
  }, []) // Empty dependency array means this effect runs once on mount

  const fetchItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.getAll()
      setItems(response?.data ?? response ?? [])
    } catch (err) {
      console.error("Failed to fetch items:", err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const create = async (newItem) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.create(newItem)
      // Assuming the API returns the created item with an ID
      setItems((prevItems) => [...prevItems, { id: response.id, ...newItem }])
      fetchItems() // Re-fetch all items to ensure state is synchronized
    } catch (err) {
      console.error("Failed to create item:", err)
      setError(err)
      throw err // Re-throw to allow component to handle specific errors (e.g., stock)
    } finally {
      setLoading(false)
    }
  }

  const update = async (id, updatedItem) => {
    setLoading(true)
    setError(null)
    try {
      await apiClient.update(id, updatedItem)
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
      )
      fetchItems() // Re-fetch all items to ensure state is synchronized
    } catch (err) {
      console.error("Failed to update item:", err)
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await apiClient.delete(id)
      setItems((prevItems) => prevItems.filter((item) => item.id !== id))
      fetchItems() // Re-fetch all items to ensure state is synchronized
    } catch (err) {
      console.error("Failed to delete item:", err)
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { items, loading, error, create, update, remove, fetchItems }
}

export default useCrud
