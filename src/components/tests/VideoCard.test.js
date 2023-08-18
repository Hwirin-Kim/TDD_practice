import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";
import { formatAgo } from "../../util/date";
import VideoCard from "../VideoCard";
import userEvent from "@testing-library/user-event";

describe("VideoCard", () => {
  const video = {
    id: 1,
    snippet: {
      title: "title",
      channelId: 1,
      channelTitle: "channelTitle",
      publishedAt: new Date(),
      thumbnails: {
        medium: {
          url: "http://image/",
        },
      },
    },
  };
  const { title, channelId, channelTitle, publishedAt, thumbnails } =
    video.snippet;
  it("renders a video item", () => {
    render(
      <MemoryRouter>
        <VideoCard video={video} />
      </MemoryRouter>
    );
    const image = screen.getByRole("img");
    expect(image.src).toBe(thumbnails.medium.url);
    expect(image.alt).toBe(title);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(channelTitle)).toBeInTheDocument();
    expect(screen.getByText(formatAgo(publishedAt))).toBeInTheDocument();
  });

  it("navigates to detailed video page with video state when clicked", () => {
    function LocationStateDisplay() {
      return <pre>{JSON.stringify(useLocation().state)}</pre>;
    }
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<VideoCard video={video} />} />
          <Route
            path={`/videos/watch/${video.id}`}
            element={<LocationStateDisplay />}
          />
        </Routes>
      </MemoryRouter>
    );
    const card = screen.getByRole("listitem");
    userEvent.click(card);

    expect(screen.getByText(JSON.stringify({ video }))).toBeInTheDocument();
  });
});
