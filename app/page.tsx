import { getPastebin, getPastebinResult } from './(pastebin)/actions';
import { FormFieldGenerator } from '@/components/form-fields/form-field-generator';
import { TemplateProvider } from '@/components/template-provider';
import { TemplateInput } from '@/components/templater/template-input';
import { GenerateOutput } from '@/components/templater/generate-output';
import { TemplateDebug } from '@/components/templater/template-debug';
import { Metadata } from 'next';
import { getGistDataById } from './(github-gist)/actions';

type Props = {
  searchParams?: Promise<{ pastebin?: string; gist?: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const metadata: Metadata = {
    title: 'Text Templater',
    description: 'Plain Text Template to Form Field Generator',
  };

  if (searchParams?.pastebin) {
    const pastebin = searchParams.pastebin;
    const pasteBinRes = await getPastebin(`https://pastebin.com/${pastebin}`);
    if ('error' in pasteBinRes) {
      return metadata;
    } else {
      const pasteBinContent = pasteBinRes.metadata;
      if (pasteBinContent.title) {
        metadata.title = pasteBinContent.title + ' - Text Templater';
        metadata.description = 'Plain Text Template to Form Field Generator for ' + pasteBinContent.title;
      }
    }
  }

  return metadata;
}

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const dataInput = {
    type: '',
    url: '',
    content: {} as any,
    error: '',
  };
  const pastebinurl = searchParams?.pastebin ? 'https://pastebin.com/' + searchParams.pastebin : '';
  const gistId = searchParams?.gist || '';
  if (pastebinurl) {
    const res = await getPastebin(pastebinurl);
    if ('error' in res) {
      dataInput.error = res.error;
    } else {
      dataInput.type = 'pastebin';
      dataInput.url = pastebinurl;
      dataInput.content = res as getPastebinResult;
    }
  } else if (gistId) {
    try {
      const res = await getGistDataById(gistId);

      dataInput.type = 'gist';
      dataInput.url = res.html_url;
      dataInput.content = res as any;
    } catch (error: any) {
      dataInput.error = error.message;
    }
  }

  const titleSection = (title?: string, author?: string) => {
    return (
      <>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {title || 'Generated Form Fields'}
        </h1>
        {author && <p className="text-xl text-muted-foreground">By {author}</p>}
      </>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-start gap-4">
      <TemplateProvider key={dataInput.content?.content || ''} templateInit={dataInput.content?.content || ''}>
        <TemplateInput input={dataInput} />
        <label className="form-control relative w-full min-w-full flex-row flex-wrap">
          <TemplateDebug />
        </label>
        {titleSection(dataInput.content?.metadata?.title, dataInput.content?.metadata?.author)}
        <FormFieldGenerator />
        <GenerateOutput />
      </TemplateProvider>
    </main>
  );
}
