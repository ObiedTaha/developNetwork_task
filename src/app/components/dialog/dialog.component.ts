import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Inote } from 'src/app/core/interfaces/inote';
import { NoteService } from 'src/app/core/services/note.service';
import { Status } from 'src/app/core/interfaces/status';




@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatDialogModule, MatButtonModule, MatSelectModule, MatInputModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  constructor(private _FormBuilder: FormBuilder, private _NoteService: NoteService, public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Inote, private _Router: Router,) {

  }


  noteForm: FormGroup = this._FormBuilder.group({
    title: [this.data.title ? this.data.title : ''],
    content: [this.data.content ? this.data.content : ''],
    status: [this.data.status ? this.data.status : ''],

  });
  status: Status[] = [
    { value: 'notStarted', viewValue: 'Not Started' },
    { value: 'progress', viewValue: 'Progress' },
    { value: 'finished', viewValue: 'Finished' },
  ];

  handelUserAction(form: FormGroup): void {
    if (!this.data.title && !this.data.content)
      this.addNewNote(form.value);
    else
      this.updateNote(form.value)

  };



  addNewNote(newNote: Inote): void {
    if ('' || null != localStorage.getItem('token')) {

      this._NoteService.AddNote(newNote).subscribe({
        next: (response) => {
          if (response.msg == 'done') {
            this.dialogRef.close();
          }
        }
      })
    } else {
      this._Router.navigate(['/signin']);
      this.dialogRef.close();
    }
  };

  updateNote(newNote: Inote): void {
    this._NoteService.updateNote(newNote, this.data._id).subscribe({
      next: (response) => {
        if (response.msg == 'done') {
          this.dialogRef.close()
        }

      }
    })
  }
}
