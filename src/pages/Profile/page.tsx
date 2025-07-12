import activities from "../../data/activities";
import profileData from "../../data/profileData";
import { ActivityCard, Badges, NavBar, Header, ProfileCard } from "./_components";

function ProfilePage() {
    return (
      <>
        <Header title="Profil" />
        <ProfileCard {...profileData} />
        <Badges />
        {activities.map((a, i) => (
          <ActivityCard key={i} time={a.time} activity={a.activity} />
        ))}
        <NavBar />
      </>
    );
  }
  export default ProfilePage