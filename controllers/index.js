// Define controller function for home page
const showHomePage = async (req, res) => {
  const title = 'Home';

  res.render('home', { title });
};

// Export controller
export { showHomePage };