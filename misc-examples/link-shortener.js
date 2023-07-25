import fs from "fs";

fs.writeFileSync("/tmp/count.txt", "0"); // only run once

function setUrl(url) {
  const id = Number(fs.readFileSync("/tmp/count.txt").toString()) + 1;
  fs.writeFileSync("/tmp/count.txt", String(id));
  fs.writeFileSync(`/tmp/${id}.txt`, url);
  return `sho.rt/${id}`;
}

function getUrl(code) {
  return fs.readFileSync(`/tmp/${code}.txt`).toString();
}

// to make above code work with several processes trying to read/write at once
// we could introduce a file system based "lock"
// a lock can be implemented using FS by attempting to create a file, but only if the file does'nt already exist
// This can be done with `wx` flag when writing a file

fs.writeFileSync("/tmp/lock.txt", "", { flag: "wx" });

// assuming the file does not already exist, this code will creat ean empty file called lock.txt
// and will continue running
// At that point, the app is free to increment the counter value
// and then release the lock by deleting the file with fs.unlinkSync();

// However, if the file does exist, the app must continously check if the other process
// which created the file has deleted it
// can be done in a while loop, for example

// However, if not careful, could lead to deadlocks
