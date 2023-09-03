import { google } from "googleapis";
import casual from "casual";

import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const authenticateGoogle = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: __dirname + "/google.json",
    scopes: "https://www.googleapis.com/auth/drive",
  });
  return auth;
};
const driveService = google.drive({
  version: "v3",
  auth: authenticateGoogle(),
});
class GoogleDrive {
  static async renderAllDocument() {
    const { data } = await driveService.files.list();
    return data.files;
  }
  static async upLoadSound(path) {
    try {
      const createfile = await driveService.files.create({
        requestBody: {
          name: casual.uuid + ".mp3",
          parents: ["1ZSyduZPzR79uWFqPBdBPL6Q575ADeUig"],
        },
        media: {
          mimeType: "video/*",
          body: fs.createReadStream(path),
        },
      });
      await DeleteFileInServer(path);
      return createfile.data.id;
    } catch (error) {
      console.log("Upload file error", error.message);
      return null;
    }
  }
  static async UploadFileFromDesktop(fileUpload) {
    try {
      const createfile = await driveService.files.create({
        requestBody: {
          name: fileUpload.filename,
          parents: ["1ZSyduZPzR79uWFqPBdBPL6Q575ADeUig"],
        },
        media: {
          mimeType: fileUpload.mimetype,
          body: fs.createReadStream(fileUpload.path),
        },
      });

      const urlDownload = await this.getFile(createfile.data.id);
      return {
        url: urlDownload,
        fileName: fileUpload.filename,
        path: createfile.data.id,
        size: fileUpload.size,
      };
    } catch (error) {
      console.log("Upload file error", error.message);
      return null;
    }
  }
  static async getFile(fileId) {
    try {
      const getUrl = await driveService.files.get({
        fileId,
        fields: "webViewLink,webContentLink",
      });
      const fileLink = getUrl.data.webContentLink;

      return fileLink;
    } catch (error) {
      console.error("Lỗi lấy path file:", error.message);
    }
  }
  static async deletefile(fileId) {
    try {
      await driveService.files.delete({
        fileId: fileId,
      });
      console.log("Xóa file  thành công");
    } catch (error) {
      console.error("Lỗi xóa file:", error.message);
    }
  }
}
function DeleteFileInServer(filePath) {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return;
    }

    console.log("File deleted successfully.");
  });
}
export default GoogleDrive;
