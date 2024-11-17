import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const templateName = searchParams.get("templateName");

  if (!templateName) {
    console.error("Template name is missing");
    return NextResponse.json({ error: "Template name is required" }, { status: 400 });
  }

  try {
    console.log("Fetching file list from Uploadthing...");
    const { files } = await utapi.listFiles();
    console.log("Files from Uploadthing:", files);

    const cssFile = files.find((file) => file.name === `${templateName}.css`);
    if (!cssFile) {
      console.error(`CSS file not found for template: ${templateName}`);
      return NextResponse.json({ error: "CSS file not found" }, { status: 404 });
    }

    console.log("Found CSS file:", cssFile);
    console.log("Fetching file URL for key:", cssFile.key);

    const fileUrls = await utapi.getFileUrls([cssFile.key]);
    console.log("File URLs response:", fileUrls);

    // Accessing the data property correctly
    if (!fileUrls || !fileUrls.data || fileUrls.data.length === 0 || !fileUrls.data[0].url) {
      console.error("Invalid file URL response:", fileUrls);
      return NextResponse.json({ error: "File URL data is invalid" }, { status: 500 });
    }

    const fileUrl = fileUrls.data[0].url;
    console.log("Returning file URL:", fileUrl);

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Error fetching CSS file:", error);
    return NextResponse.json({ error: "Failed to fetch CSS file" }, { status: 500 });
  }
}
