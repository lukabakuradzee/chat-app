export const handleAsyncOperation = async (operation, setLoading, setError) => {
  try {
    setLoading(true);
    return await operation();
  } catch (error) {
    console.error(error);
    setError(error);
  } finally {
    setLoading(false);
    // setSubmitting(false);

  }
};
