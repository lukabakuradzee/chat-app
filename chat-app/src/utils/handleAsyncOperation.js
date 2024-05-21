export const handleAsyncOperation = async (operation, setLoading, setMessage) => {
  try {
    setLoading(true);
    return await operation();
  } catch (error) {
    console.error(error);
    setMessage(error);
  } finally {
    setLoading(false);
    // setSubmitting(false);

  }
};
