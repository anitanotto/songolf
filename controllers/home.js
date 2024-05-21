export default {
    getIndex: (req, res) => {
        res.render("index.ejs", { message: "Connecting to game server..." });
    },
    getHome: (req, res) => {
        res.render("components/home.ejs");
    },
    getNavButton: (req, res) => {
        const query = req.query;
        const button = query.button;

        const validNavButtons = new Set(['home', 'profile']);

        if (validNavButtons.has(button)) {
            res.render("components/navButton.ejs", { button: button });
        } else {
            res.send("<div id=navButton></div>");
        }
    },
    getProfile: (req, res) => {
        res.render("components/profile.ejs");
    }
};
