import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { useTranslation } from "react-i18next";
import { Trash2 } from 'lucide-react';

type EmployeeFileType = 
  'pdp' | 'pdc' | 
  'self_evaluation' | 'boss_evaluation' | 'calibration' |
  'asesor_evaluation' | 'capacitador_evaluation' | 'final_calibration' | 'legajo';

interface FileDialogProps {
  employeeId: string;
  fileType: EmployeeFileType;
  onFileUploaded?: (url: string) => void;
}

interface FileInfo {
  url: string;
  name: string;
}

export const FileManagementDialog: React.FC<FileDialogProps> = ({ 
  employeeId, 
  fileType, 
  onFileUploaded 
}) => {
  const { t } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  
  const storage = getStorage();
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Para legajo, permitimos múltiples archivos
      const fileRef = ref(storage, `${fileType}/${employeeId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      
      onFileUploaded?.(fileUrl);
      fetchUploadedFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const listRef = ref(storage, `${fileType}/${employeeId}`);
      const res = await listAll(listRef);
      
      const fileInfos = await Promise.all(
        res.items.map(async (itemRef) => ({
          url: await getDownloadURL(itemRef),
          name: itemRef.name
        }))
      );
      
      setUploadedFiles(fileInfos);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const openFileInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const deleteFile = async (fileInfo: FileInfo) => {
    try {
      const fileRef = ref(storage, `${fileType}/${employeeId}/${fileInfo.name}`);
      await deleteObject(fileRef);
      fetchUploadedFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // Mapeamos los tipos de archivos a sus traducciones
  const getFileTypeTranslation = () => {
    const fileTypeMap: Record<EmployeeFileType, string> = {
      'pdp': 'PDP',
      'pdc': 'PDC',
      'self_evaluation': 'Autoevaluación',
      'boss_evaluation': 'Evaluación Jefe',
      'calibration': 'Calibración',
      'asesor_evaluation': 'Evaluación Asesor',
      'capacitador_evaluation': 'Evaluación Capacitador',
      'final_calibration': 'Calibración Final',
      'legajo': 'Legajo'
    };
    return fileTypeMap[fileType] || fileType.toUpperCase();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          onClick={() => fetchUploadedFiles()}
        >
          {t(`desempeño.evaluationPage.actions.upload${getFileTypeTranslation().replace(/\s/g, '')}`)}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-950 dark:text-white">
        <DialogHeader>
          <DialogTitle>
            {t(`desempeño.evaluationPage.dialogs.${fileType}Title`, { fileType: getFileTypeTranslation() })}
          </DialogTitle>
          <DialogDescription>
            {t(`desempeño.evaluationPage.dialogs.${fileType}Description`, { fileType: getFileTypeTranslation() })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
        <div className="flex items-center justify-between border-2 border-dashed border-gray-300 p-4 rounded-lg">
          <label 
            htmlFor="file-upload" 
            className="cursor-pointer text-gray-700 hover:text-gray-900 font-semibold flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>{t('desempeño.evaluationPage.actions.uploadFile')}</span>
          </label>
          <input 
            id="file-upload"
            type="file" 
            accept=".pdf,.docx,.doc" 
            onChange={handleFileUpload} 
            className="hidden"
          />
        </div>
          
          {uploadedFiles.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">
                {t('desempeño.evaluationPage.dialogs.uploadedFiles')}
              </h3>
              {uploadedFiles.map((fileInfo, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-2 border-b last:border-b-0"
                >
                  <span className="truncate max-w-[200px]">
                    {fileInfo.name}
                  </span>
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => openFileInNewTab(fileInfo.url)}
                    >
                      {t('desempeño.evaluationPage.actions.view')}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteFile(fileInfo)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Botón para cargar otro archivo */}
          <Button
         className='dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800'
            variant="outline" 
            onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
          >
            {t('desempeño.evaluationPage.actions.uploadAnotherFile')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};