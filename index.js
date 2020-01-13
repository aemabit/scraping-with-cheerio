const request = require("request-promise");
const cheerio = require("cheerio");

const instagram = async () => {
  const USERNAME = "aemabit";
  const BASE_URL = `https://www.instagram.com/${USERNAME}/`;

  // call all source page
  let response = await request(BASE_URL);

  // cheerio take the response
  let $ = cheerio.load(response);

  // filter specif script data
  let script = $('script[type="text/javascript"]')
    .eq(3)
    .html();

  // TOOL = https://regexr.com/
  // SELECT ALL USING = window._sharedData = (.+)
  // GET ARRAYS IN THE REQUEST
  let script_regex = /window._sharedData = (.+);/g.exec(script);

  // TRANSFORM MY REGEX IN AN ARRAY OF OBJECTS AND SELECT SPECIFIC ARRAY TO TAKE THE INFORMATION IN THIS CASE THE NUMBER 2
  // WHEN YOU LOOK THE INFORMATION IN YOUR DEBUGGER YOU CAN DESTRUCTURE THE DATA
  let {
    entry_data: {
      ProfilePage: {
        [0]: {
          graphql: { user }
        }
      }
    }
  } = JSON.parse(script_regex[1]);

  //////////////////////////////////////////////////////////////////////
  //   THIS IS ANOTHER WAY TO TAKE THE INFORMATION TO THE USER        //
  //                                                                  //
  //   let test = JSON.parse(script_regex[1]);                        //
  //   const TAKEUSER = test.entry_data.ProfilePage[0].graphql.user   //
  //   console.log(TAKEUSER);                                         //
  //////////////////////////////////////////////////////////////////////

  let instagram_user = {
    followers: user.edge_followed_by.count,
    following: user.edge_follow.count,
    uploads: user.edge_owner_to_timeline_media.count,
    full_name: user.full_name,
    picture: user.profile_pic_url_hd
  };

  console.log(instagram_user);

  // USE DEBUGGER
  debugger;
};

instagram();
