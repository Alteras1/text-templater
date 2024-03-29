import { getPastebin, getPastebinResult } from './(pastebin)/actions';
import { FormFieldGenerator } from '@/components/form-fields/form-field-generator';
import { TemplateProvider } from '@/components/template-provider';
import { TemplateInput } from '@/components/templater/template-input';
import { GenerateOutput } from '@/components/templater/generate-output';
import { TemplateDebug } from '@/components/templater/template-debug';
import { Metadata } from 'next';

type Props = {
  searchParams?: { pastebin?: string };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
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

export default async function Home({ searchParams }: Props) {
  const pastebinurl = searchParams?.pastebin ? 'https://pastebin.com/' + searchParams.pastebin : '';
  const pastebinObj = {
    url: pastebinurl,
    content: {} as getPastebinResult,
    error: '',
  };
  if (pastebinurl) {
    const res = await getPastebin(pastebinurl);
    if ('error' in res) {
      pastebinObj.error = res.error;
    } else {
      pastebinObj.content = res;
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
      <TemplateProvider key={pastebinObj.content?.content || ''} templateInit={pastebinObj.content?.content || ''}>
        <TemplateInput pastebin={pastebinObj} />
        <label className="form-control relative w-full min-w-full flex-row flex-wrap">
          <TemplateDebug />
        </label>
        {titleSection(pastebinObj.content?.metadata?.title, pastebinObj.content?.metadata?.author)}
        <FormFieldGenerator />
        <GenerateOutput />
      </TemplateProvider>
    </main>
  );
}
