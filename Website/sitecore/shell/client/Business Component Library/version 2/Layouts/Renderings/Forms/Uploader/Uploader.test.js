(function(sc, describe, it, beforeEach, afterEach, expect, _) {
  var addedFiles, folderId, fatalError = false;

  sc.app.on("upload-fileAdded", function(fileModel) {
    addedFiles.push(fileModel);
  });

  sc.app.on("upload-info-deleted", function(fileModel) {
    addedFiles = _.without(addedFiles, fileModel);
  });

  describe("Given an Uploader control with default property values", function() {
    var model = sc.app.UploaderDefault,
        $element = $(model.el);

    it("the 'core' database should be used by default", function() {
      expect(model.Database).toBe("core");
    });

    describe("when a file is added to the queue", function() {
      beforeEach(function(done) {
        addedFiles = [];
        addJpgFile("firstFile", $element);

        wait(function() {
          return addedFiles.length === 1;
        }, done);
      });

      afterEach(function() {
        for (var i = addedFiles.length - 1; i >= 0; i--) {
          sc.app.trigger("upload-info-deleted", addedFiles[i]);
        }

        var options = $element.find(".sc-uploader-fileupload").data("blueimp-fileupload").options;
        options.fileInput.context.form.__ids = [];
      });

      describe("when upload() function is called", function() {
        beforeEach(function(done) {
          model.once("uploadCompleted", done);
          model.upload();
        });

        afterEach(function(done) {
          $.get("/sitecore/api/ssc/item?path=/sitecore/media library/firstFile&database=core")
          .done(function(item) {
            $.ajax({
              type: "DELETE",
              url: "/sitecore/api/ssc/item/{" + item.ItemID + "}?database=core",
              complete: done
            });
          });
        });

        it("the file should be uploaded to 'media library' folder", function(done) {
          $.get("/sitecore/api/ssc/item?path=/sitecore/media library/firstFile&database=core")
          .done(function(item) {
            expect(item.ItemName).toBe("firstFile");
            done();
            });
        });
      });
    });
  });

  describe("Given an Uploader control", function() {
    var model = sc.app.UploaderMaster,
        $element = $(model.el);

    describe("when a file is added to the queue", function() {
      beforeEach(function(done) {
        addedFiles = [];
        addJpgFile("firstFile", $element);

        wait(function() {
          return addedFiles.length === 1;
        }, done);
      });

      afterEach(function() {
        for (var i = addedFiles.length - 1; i >= 0; i--) {
          sc.app.trigger("upload-info-deleted", addedFiles[i]);
        }

        var options = $element.find(".sc-uploader-fileupload").data("blueimp-fileupload").options;
        options.fileInput.context.form.__ids = [];
      });

      it("the Info panel should be visible", function() {
        expect($element.is(":visible")).toBe(true);
      });

      it("the 'upload-fileAdded' event should be triggered on application level", function() {
        expect(addedFiles[0].get("name")).toBe("firstFile");
      });

      describe("when second file is added to the queue", function() {
        beforeEach(function(done) {
          addJpgFile("secondFile", $element);

          wait(function() {
            return addedFiles.length === 2;
          }, done);
        });

        it("the TotalFiles property should be updated", function() {
          expect(model.TotalFiles).toBe(2);
        });

        it("the TotalSize property should contain sum of file sizes", function() {
          expect(model.TotalSize).toBe("26.8 Kb");
        });

        describe("when the SpeakTest foler is created in media library", function() {
          beforeEach(createTestFolder);
          afterEach(removeTestFolder);

          describe("when upload() function is called", function() {
            var uploadingPanelVisibleWhileUploading,
              progressBarVisibleWhileUploading,
              percentageChangedCount,
              fileUploadedEventLog,
              uploadCompletedTriggered;

            beforeEach(function(done) {
              uploadingPanelVisibleWhileUploading = false;
              progressBarVisibleWhileUploading = false;
              percentageChangedCount = 0;
              fileUploadedEventLog = "";
              uploadCompletedTriggered = 0;

              sc.app.on("upload-fileUploaded", function(fileModel) {
                fileUploadedEventLog += fileModel.name + " uploaded; ";
              });

              model.on("change:UploadedFiles", function() {
                if (model.UploadedFiles === 1) {
                  if ($element.find(".sc-uploader-general-info-data-uploadingData").is(":visible")) {
                    uploadingPanelVisibleWhileUploading = true;
                  }

                  if ($element.find(".sc-uploader-general-info-progressbar").is(":visible")) {
                    progressBarVisibleWhileUploading = true;
                  }
                }
              });

              model.on("change:GlobalPercentage", function() {
                percentageChangedCount++;
              });

              model.on("uploadCompleted", function() {
                uploadCompletedTriggered++;
                done();
              });

              model.upload();
            });

            afterEach(function() {
              sc.app.off("upload-fileUploaded");
              model.off("change:UploadedFiles");
              model.off("change:GlobalPercentage");
              model.off("uploadCompleted");
            });

            it("the files should be uploaded to server", function(done) {
              $.get("/sitecore/api/ssc/item/{" + folderId + "}/children?database=master")
                .done(function(items) {
                  expect(items.length).toBe(2);
                  done();
                });
            });

            it("the Uploading panel should be visible during uploading", function() {
              expect(uploadingPanelVisibleWhileUploading).toBe(true);
              expect($element.find(".sc-uploader-general-info-data-uploadingData").is(":visible")).toBe(false);
            });

            it("the progress bar should be visible during uploading", function() {
              expect(progressBarVisibleWhileUploading).toBe(true);
              expect($element.find(".sc-uploader-general-info-progressbar").is(":visible")).toBe(false);
            });

            it("the GlobalPercentage property should be updated during uploading", function() {
              expect(percentageChangedCount).toBeGreaterThan(0);
              expect(model.GlobalPercentage).toBe(100);
            });

            it("file model should be updated with ID of the created item", function(done) {
              $.get("/sitecore/api/ssc/item/{" + folderId + "}/children?database=master")
                  .done(function(items) {
                    expect(addedFiles[0].get("itemId").toLowerCase()).toBe("{" + items[0].ItemID + "}");
                    expect(addedFiles[1].get("itemId").toLowerCase()).toBe("{" + items[1].ItemID + "}");
                    done();
                  });
            });

            it("file model should be updated with item icon", function(done) {
              $.get("/sitecore/api/ssc/item/{" + folderId + "}/children?database=master")
                .done(function() {
                  expect(addedFiles[0].get("image").toLowerCase()).toContain("/files/speaktest/firstfile.ashx");
                  expect(addedFiles[1].get("image").toLowerCase()).toContain("/files/speaktest/secondfile.ashx");
                  done();
                });
            });

            it("the 'error' property of file model should be false", function() {
              expect(addedFiles[0].get("error")).toBe(false);
            });

            it("the 'upload-fileUploaded' event should be triggered twice on application level", function() {
              expect(fileUploadedEventLog).toContain("firstFile uploaded; ");
              expect(fileUploadedEventLog).toContain("secondFile uploaded; ");
            });

            it("the UploadedFiles property should be updated", function() {
              expect(model.UploadedFiles).toBe(2);
            });

            it("the 'uploadCompleted' event should be triggered", function() {
              expect(uploadCompletedTriggered).toBe(1);
            });

            describe("when third file is added to the queue", function() {
              beforeEach(function(done) {
                addJpgFile("thirdFile", $element);

                wait(function() {
                  return addedFiles.length === 3;
                }, done);
              });

              it("the UploadedFiles property should be reset", function() {
                expect(model.UploadedFiles).toBe(0);
              });

              it("the GlobalPercentage property should be reset", function() {
                expect(model.GlobalPercentage).toBe(0);
              });
            });
          });

          describe("when file Name, Description and Alternative Text are updated ('upload-info-updated' event is triggered)", function() {
            beforeEach(function(done) {
              sc.app.once("upload-info-updated", done);

              addedFiles[0].set("name", "firstFileMod.jpg");
              addedFiles[0].set("description", "description 2");
              addedFiles[0].set("alternate", "alternate 2");
              sc.app.trigger("upload-info-updated", addedFiles[0]);
            });

            describe("when upload() function is called", function() {
              beforeEach(function(done) {
                model.once("uploadCompleted", done);
                model.upload();
              });

              it("the files should be uploaded with correct Name, Description and Alternative Text", function(done) {
                $.get("/sitecore/api/ssc/item/{" + folderId + "}/children?database=master")
                  .done(function(items) {
                    expect(items[0].ItemName).toBe("firstFileModjpg");
                    expect(items[0].Description).toBe("description 2");
                    expect(items[0].Alt).toBe("alternate 2");

                    expect(items[1].ItemName).toBe("secondFile");
                    expect(items[1].Description).toBe("");
                    expect(items[1].Alt).toBe("");
                    done();
                  });
              });
            });
          });
        });

        describe("when 'upload-info-deleted' event is triggered for the first file", function() {
          beforeEach(function(done) {
            sc.app.trigger("upload-info-deleted", addedFiles[0]);

            wait(function() {
              return model.TotalFiles === 1;
            }, done);
          });

          it("the TotalFiles property should be updated", function() {
            expect(model.TotalFiles).toBe(1);
          });

          it("the TotalSize property should be updated", function() {
            expect(model.TotalSize).toBe("13.4 Kb");
          });

          describe("when 'upload-info-deleted' event is triggered for the second file", function() {
            beforeEach(function(done) {
              sc.app.trigger("upload-info-deleted", addedFiles[0]);

              wait(function() {
                return model.TotalFiles === 0;
              }, done);
            });

            it("the Uploading panel should be hidden", function() {
              expect($element.find(".sc-uploader-general-info-data-uploadingData").is(":hidden")).toBe(true);
            });
          });
        });
      });
    });

    describe("when DestinationUrl property is changed to 'xxx'", function() {
      var urlBackup;

      beforeEach(function() {
        urlBackup = model.DestinationUrl;
        model.DestinationUrl = "xxx";
      });

      afterEach(function() {
        model.DestinationUrl = urlBackup;
      });

      describe("when a file is added to the queue", function() {
        beforeEach(function(done) {
          addedFiles = [];
          addJpgFile("firstFile", $element);

          wait(function() {
            return addedFiles.length === 1;
          }, done);
        });

        afterEach(function() {
          for (var i = addedFiles.length - 1; i >= 0; i--) {
            sc.app.trigger("upload-info-deleted", addedFiles[i]);
          }

          var options = $element.find(".sc-uploader-fileupload").data("blueimp-fileupload").options;
          options.fileInput.context.form.__ids = [];
        });

        describe("when upload() function is called", function() {
          it("the 'sc-error' event should be triggered on application level", function(done) {
            sc.app.once("sc-error", function(errorItems) {
              expect(errorItems[0].id).toBe(addedFiles[0].id);
              done();
            });

            model.upload();
          });

          it("the 'upload-error' event should be triggered on application level", function(done) {
            sc.app.once("upload-error", function(arg) {
              expect(arg.errors[0].id).toBe(addedFiles[0].id);
              done();
            });

            model.upload();
          });
        });
      });
    });

    describe("when ExecutionTimeout property is changed to 0", function() {
      var executionTimeoutBackup;

      beforeEach(function() {
        executionTimeoutBackup = model.ExecutionTimeout;
        model.ExecutionTimeout = 0;
      });

      afterEach(function() {
        model.ExecutionTimeout = executionTimeoutBackup;
      });

      describe("when files are added to the queue", function() {
        beforeEach(function(done) {
          addedFiles = [];
          addJpgFile("firstFile", $element);
          addJpgFile("secondFile", $element);
          addJpgFile("thirdFile", $element);

          wait(function() {
            return addedFiles.length === 3;
          }, done);
        });

        afterEach(function() {
          for (var i = addedFiles.length - 1; i >= 0; i--) {
            sc.app.trigger("upload-info-deleted", addedFiles[i]);
          }

          var options = $element.find(".sc-uploader-fileupload").data("blueimp-fileupload").options;
          options.fileInput.context.form.__ids = [];
        });

        describe("when the SpeakTest foler is created in media library", function() {
          beforeEach(createTestFolder);
          afterEach(removeTestFolder);

          describe("when upload() function is called", function() {
            var scErrorArg;

            beforeEach(function(done) {
              scErrorArg = null;
              sc.app.once("sc-error", function(arg) {
                scErrorArg = arg;

                wait(function() {
                  return model.QueueWasAborted;
                }, done);
              });

              model.upload();
            });

            it("the 'sc-error' event should be triggered on application level", function() {
              expect(scErrorArg[0].id).toBe("uploadErrorTimeout");
              expect(scErrorArg[0].Message).toBe("The media files could not be uploaded. Please try again.");
            });

            it("the QueueWasAborted property should be set", function() {
              expect(model.QueueWasAborted).toBe(true);
            });

            describe("when one file is added to the queue", function() {
              beforeEach(function(done) {
                model.once("change:QueueWasAborted", done);

                addJpgFile("nextFile", $element);
              });

              it("the QueueWasAborted property should be reset", function() {
                expect(model.QueueWasAborted).toBe(false);
              });
            });
          });
        });
      });
    });
  });

  function createTestFolder(done) {
    if (fatalError) {
      throw "Fatal Error";
    }

    var onError = function() {
      fatalError = true;
      done();
    };

    $.ajax({
      type: "POST",
      url: "/sitecore/api/ssc/item/sitecore%2Fmedia%20library%2Ffiles?database=master",
      data: '{ "ItemName": "SpeakTest", "TemplateID": "FE5DD826-48C6-436D-B87A-7C4210C7413B" }',
      contentType: "application/json; charset=utf-8",
      success: function() {
        $.get("/sitecore/api/ssc/item?path=/sitecore/media library/files/SpeakTest&database=master")
          .done(function(item) {
            folderId = item.ItemID;
            done();
          })
          .fail(onError);
      },
      error: onError
    });
  }

  function removeTestFolder(done) {
    if (fatalError) {
      throw "Fatal Error";
    }

    $.ajax({
      type: "DELETE",
      url: "/sitecore/api/ssc/item/{" + folderId + "}?database=master",
      error: function() { fatalError = true; },
      complete: done
    });
  }

  function wait(check, done, interval, maxDuration) {
    interval = interval || 25;
    maxDuration = maxDuration || 5000;

    var intervalId = setInterval(function() {
      if (check()) {
        done();
        clearInterval(intervalId);
      }
    }, interval);

    setTimeout(function() {
      clearInterval(intervalId);
    }, maxDuration);
  }

  function addJpgFile(filename, $element) {
    var file = createJpgFile(filename);
    $element.find("input").fileupload("add", { files: [file] });
    return file;
  }

  function createJpgFile(filename) {
    var b64Content = "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AAIAAAAQAAAI9AEyAAIAAAAUAAAJBAE7AAIAAAADbWUAAAE8AAIAAAAQAAAJGIdpAAQAAAABAAAJKJybAAEAAAASAAARYJycAAEAAAAWAAARcpydAAEAAAAGAAARiJyeAAEAAAAMAAARjpyfAAEAAAAWAAARmuocAAcAAAgMAAAAzgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG15IHRpdGxlAAAAAABIAAAAAQAAAEgAAAABUXVpY2tUaW1lIDcuNi40ADIwMTA6MDE6MjAgMTk6NTU6NTkATWFjIE9TIFggMTAuNS44AAADoAIABAAAAAEAAAF6oAMABAAAAAEAAAF66hwABwAACAwAAAlSAAAAABzqAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABtAHkAIAB0AGkAdABsAGUAAABtAHkAIABjAG8AbQBtAGUAbgB0AAAAbQBlAAAAbQB5AHQAYQBnAAAAbQB5ACAAcwB1AGIAagBlAGMAdAAAAP/hDcZodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIi8+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPjxkYzpjcmVhdG9yPjxyZGY6U2VxIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpsaT5tZTwvcmRmOmxpPjwvcmRmOlNlcT4NCgkJCTwvZGM6Y3JlYXRvcj48ZGM6c3ViamVjdD48cmRmOkJhZyB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6bGk+bXl0YWc8L3JkZjpsaT48L3JkZjpCYWc+DQoJCQk8L2RjOnN1YmplY3Q+PGRjOnRpdGxlPjxyZGY6QWx0IHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5teSB0aXRsZTwvcmRmOmxpPjwvcmRmOkFsdD4NCgkJCTwvZGM6dGl0bGU+PGRjOmRlc2NyaXB0aW9uPjxyZGY6QWx0IHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5teSB0aXRsZTwvcmRmOmxpPjwvcmRmOkFsdD4NCgkJCTwvZGM6ZGVzY3JpcHRpb24+PC9yZGY6RGVzY3JpcHRpb24+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpNaWNyb3NvZnRQaG90bz0iaHR0cDovL25zLm1pY3Jvc29mdC5jb20vcGhvdG8vMS4wLyIvPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6TWljcm9zb2Z0UGhvdG89Imh0dHA6Ly9ucy5taWNyb3NvZnQuY29tL3Bob3RvLzEuMC8iPjxNaWNyb3NvZnRQaG90bzpMYXN0S2V5d29yZFhNUD48cmRmOkJhZyB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6bGk+bXl0YWc8L3JkZjpsaT48L3JkZjpCYWc+DQoJCQk8L01pY3Jvc29mdFBob3RvOkxhc3RLZXl3b3JkWE1QPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0ndyc/Pv/bAEMAAgEBAgEBAgICAgICAgIDBQMDAwMDBgQEAwUHBgcHBwYHBwgJCwkICAoIBwcKDQoKCwwMDAwHCQ4PDQwOCwwMDP/bAEMBAgICAwMDBgMDBgwIBwgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAB4AHgMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APzt/wCCZfwo0nxHr+qa5rdtNe2Gh2/nLZRcHU52KrBbFhkqryOgZuykms34l31x4sm8YabqegyeG/GPha5ubK70pkaORHSZonhZGy2+Ngw+YlxsOccAe1f8Evv2hYf2OfFF14gm8O6f4kWyB86zvFXyOU27mLDYMZyN3Gcd8V5n8etL1747/HTVfF17a6T4fsLxJruDQEumF+9pMGiM6W7sZRFGshYlugUuA0YLj432reIk5baWd9PS3n+B9pKioYeMI79Vbv59LfjexwPxZ+Enij4T6focfjHw7Houm+ItEh1XSrxIVXbBJJJFHKWHPzeWzAEsxjKOAucDz3UIbfxBBEd1v5yjEscmNu4dSOozz+P559T/AGr/ANpvxx+0ppVrfaxqv9tWbwtbWmoyQKfOjgYwnDhAzKCm1WcEkL1JBx86aXBE0RSaRnXqFAIxjjrg+9ehQjKUby0flr/kefiakYy5Y6prd6f56dvI/Q79jbSoNW+Lmj6HHp9rqH/CRTiO3WeFZAtwEbyiAWUMxYAKGIBZhkjGa+pv2vfhR4J0nRpPFviaOzjvG2j/AImWnmyaYwwqPKVMFH86QhGVJHjWFXfdv2RV+dfwJ+PupfDvxjoOraeWh1DRZl1K1fAIjmhlWVW98HBx6ivpj9qr9sjVP2hPBrarrFrHItuiedGyg7XC7sryc5HrjHvmvk8dgqrxUZJu22j/AK3PuctxWHdCTkltfb8PS/ofHv7WXxJtfHGqzJo8kdvpsUrfY7W3Hy2sC/LGrN0yFAJI6sWr52LtDJuVjyO1ek/FjxDceOUnubdIbS1hl8sxgbS2Bx0GK89NqRErZHpX2ODo+zpqKPz3NK/tK7kj/9k=";

    var blob = new Blob(b64toBlobContent(b64Content), { type: "image/jpeg" });
    blob.name = filename + ".jpg";

    return blob;
  }

  function b64toBlobContent(b64Data, sliceSize) {
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return byteArrays;
  }
})(Sitecore.Speak, describe, it, beforeEach, afterEach, expect, _);