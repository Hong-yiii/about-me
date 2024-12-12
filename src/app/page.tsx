import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts, getMainIntroduction } from "@/lib/api";

export default function Index() {
  const allPosts = getAllPosts();

  const mainIntroduction = getMainIntroduction();

  const morePosts = allPosts;

  return (
    <main>
      <Container>
        <Intro />
        <HeroPost
          title={mainIntroduction.title}
          coverImage={mainIntroduction.coverImage}
          date={mainIntroduction.date}
          author={mainIntroduction.author}
          slug={mainIntroduction.slug}
          excerpt={mainIntroduction.excerpt}
        />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </main>
  );
}
