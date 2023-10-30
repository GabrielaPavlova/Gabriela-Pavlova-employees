import { Component } from '@angular/core';
import * as Papa from 'papaparse';
import { parse, isValid, startOfDay } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  uploadedFile: File;
  resultData: any;
  start = new Date(startOfDay(new Date()));

  onFileSelected(file: File) {
    this.uploadedFile = file;
    this.processFile();
  }

  processFile() {
    if (this.uploadedFile) {
      Papa.parse(this.uploadedFile, {
        complete: (result: any) => {
          const csvData = result.data;
          this.resultData = this.checkLongestWorkPeriod(csvData);
        },
        header: true,
      });
    }
  }

  checkLongestWorkPeriod(employeesData: any[]): { employee1: number, daysWorked: number, employee2: number  }[] {
    const parseDate = (date: Date | string | null): Date | null => {
      if (date instanceof Date) {
        return date;
      } else if (typeof date === 'string') {
        const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
        return isValid(parsedDate) ? parsedDate : null;
      } else {
        return null;
      }
    };

    const formatDate = (date) => (date ? date : new Date());

    const employeeGroups = {};

    employeesData.forEach((entry) => {
      const empID = entry.EmpID;
      if (!employeeGroups[empID]) {
        employeeGroups[empID] = [];
      }

      employeeGroups[empID].push({
        ProjectID: entry.ProjectID,
        DateFrom: new Date(entry.DateFrom),
        DateTo: entry.DateTo ? new Date(entry.DateTo) : new Date(),
      });
    });

    let longestWorkPeriod = 0;
    let longestWorkPair: [number, number] = [0, 0];

    const employeeIDs = Object.keys(employeeGroups);
    for (let i = 0; i < employeeIDs.length; i++) {
      for (let j = i + 1; j < employeeIDs.length; j++) {
        const empID1 = parseInt(employeeIDs[i], 10);
        const empID2 = parseInt(employeeIDs[j], 10);
        const projects1 = employeeGroups[empID1];
        const projects2 = employeeGroups[empID2];

        // Find common projects between the two employees.
        const commonProjects = projects1.filter((project1) => {
          return projects2.some((project2) => {
            return project1.ProjectID === project2.ProjectID;
          });
        });

        // Calculate the total work duration for common projects.
        let totalWorkDuration = 0;
        commonProjects.forEach((project) => {
          const startDate = parseDate(project.DateFrom);
          const endDate = parseDate(project.DateTo);
          totalWorkDuration += this.calculateWorkDuration(
            formatDate(startDate),
            formatDate(endDate)
          );
        });

        if (totalWorkDuration > longestWorkPeriod) {
          longestWorkPeriod = totalWorkDuration;
          longestWorkPair = [empID1, empID2];
        }
      }
    }

    const dataProjects = [
      {
        employee1: longestWorkPair[0],
        employee2: longestWorkPair[1],
        daysWorked: longestWorkPeriod,
      },
    ];

    return dataProjects;
  }

  private calculateWorkDuration(startDate: Date, endDate: Date): number {
    // Calculate the duration in months for a project.
    const diffInMilliseconds = endDate.getTime() - startDate.getTime();
    // Approximate average days in a month.
    const diffInMonths = diffInMilliseconds / (1000 * 60 * 60 * 24 * 30.44); 

    return Math.floor(diffInMonths);
  }
}
