'use server';

type GistFile = {
  filename: string;
  content: string;
  raw_url: string;
};

type GistResponse = {
  id: string;
  description: string;
  html_url: string;
  owner: { login: string; };
  files: Record<string, GistFile>;
};

export async function getGistData(gistUrl: string) {
  // Extract Gist ID from URL
  const match = gistUrl.match(/gist\.github\.com\/(?:[^/]+\/)?([a-f0-9]+)/i);
  if (!match) {
    throw new Error('Invalid Gist URL');
  }
  const gistId = match[1];

  return getGistDataById(gistId);
}

export async function getGistDataById(gistId: string) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Gist');
  }

  const gist: GistResponse = await res.json();

  // Get the first file
  const firstFile = Object.values(gist.files)[0];
  const content = await getGistContent(firstFile.raw_url);

  return {
    id: gist.id,
    metadata: {
      title: gist.description,
      author: gist.owner.login,
    },
    content: content,
    html_url: gist.html_url,
  };
}

async function getGistContent(rawUrl: string) {
  const res = await fetch(rawUrl, { next: { revalidate: 3600 } });
  return res.text();
}
